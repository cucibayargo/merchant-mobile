interface IUserProps {
    children: React.ReactNode
}

interface IUserDetails {
    id: string
    name: string
    email: string
    phone_number: string
    logo: string
    address?: string
    plan_name: string
    isInExpiry: boolean
    subscription_end: string
}
