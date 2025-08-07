import React from 'react'

export type Breadcrumb = {
    title: string
    showBackIcon: boolean
    backAction: (url: string) => void
    updateBreadcrumb: () => void
}

export interface IBreadcrumbProps {
    children: React.ReactNode
}

export interface IBreadcrumbComponentProps {
    className?: string
}
