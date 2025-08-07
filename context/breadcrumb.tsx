import React, { JSX, useState } from 'react'
import { IBreadcrumbProps } from '@/types/breadcrumb'

export const BreadcrumbContext = React.createContext<any>({
    title: '',
    setTitle: () => {},
    showBackIcon: false,
    setShowBackIcon: () => {},
    showTitle: false,
    setShowTitle: () => {},
    prevPath: '',
    setPrevPath: () => {},
})

export const BreadcrumbProvider: React.FunctionComponent<IBreadcrumbProps> = ({
    children,
}: IBreadcrumbProps): JSX.Element => {
    const [title, setTitle] = useState<string>('')
    const [showBackIcon, setShowBackIcon] = useState<boolean>(false)
    const [showTitle, setShowTitle] = useState<boolean>(true)
    const [prevPath, setPrevPath] = useState<string>('/')
    return (
        <BreadcrumbContext.Provider
            value={{
                title,
                setTitle,
                showBackIcon,
                setShowBackIcon,
                showTitle,
                setShowTitle,
                prevPath,
                setPrevPath,
            }}
        >
            {children}
        </BreadcrumbContext.Provider>
    )
}
