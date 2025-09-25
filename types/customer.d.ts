export interface IGetCustomerProps {
    limit: number
    page: number
    filter: string
}

export interface ICustomer {
    created_at: string
    merchant_id: string
    id: string
    name: string
    address: string
    phone_number: string
    email: string | null
    gender: string
}

export type Gender = 'Laki-laki' | 'Perempuan'

export interface ICustomerDesktopProps {
    className: string
    changeFilterHandler: (val: React.KeyboardEvent<HTMLInputElement>) => void
    data: ICustomer[]
    isLoadingData: boolean
    deleteCustomer: (val: string) => void
    isLast: boolean
    isFirst: boolean
    pageSize: number
    prev: (val: Source) => void
    next: (val: Source) => void
    isCreateOrder: boolean
    openDurationDialog: (val: string) => void
    refetchData: () => void
}

export interface ICustomerDetailDialogProps {
    counter: number
    customerId: string
    customerCreated: () => void
}
