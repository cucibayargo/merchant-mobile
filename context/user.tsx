import React, { createContext, useContext, useState } from 'react'

interface UserContextType {
    user: IUserDetails | null
    setUser: (user: IUserDetails | null) => void
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

    const value = {
        user,
        setUser,
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
