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
