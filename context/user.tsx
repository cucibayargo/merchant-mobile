import * as SecureStore from 'expo-secure-store'
import React, { createContext, useContext, useState } from 'react'

interface UserContextType {
    user: IUserDetails | null
    setUser: (user: IUserDetails | null) => void
    isAuthenticated: boolean
    isLoading: boolean
    setIsLoading: (loading: boolean) => void
    logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<IUserDetails | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const isAuthenticated = !!user

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync('authToken')
            setUser(null)
        } catch (error) {
            console.error('Error during logout:', error)
        }
    }

    const value = {
        user,
        setUser,
        isAuthenticated,
        isLoading,
        setIsLoading,
        logout,
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
