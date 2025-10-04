interface IGetOrdersProps {
    status: OrderType
    filter?: string
    date_from?: string
    date_to?: string
    page: number
    limit: number
}

interface IOngoingOrder {
    id: string
    customer: string
    status: OrderType
    invoice: string
    payment_status: PaymentStatus
    created_at: string
    ready_to_pick_up_at: string
    completed_at: string
    estimated_date: string
}

export interface IOrder {
    transaction_id: string
    customer_id: string
    customer_name: string
    customer_address: string
    customer_phone_number: string
    ready_to_pick_up_at: string
    completed_at: string
    estimated_date: string
    created_at: string
    note: string
    duration_name: string
    transaction_status: string
    invoice: string
    total: number
    payment_status: string
    payment_id: string
    services: IOrderService[]
}

export interface IOrderService {
    service_id: string
    service_name: string
    service_unit: string
    price: number
    quantity: number
}
