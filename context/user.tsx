import React, { useState } from 'react'

export const UserContext = React.createContext<any>(null)

export const UserProvider: React.FunctionComponent<IUserProps> = ({
    children,
}: IUserProps) => {
    const [userDetails, setUserDetails] = useState<IUserDetails>(
        JSON.parse(localStorage.getItem('userDetails')!)
    )

    return (
        <UserContext.Provider
            value={{
                userDetails,
                setUserDetails,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}
