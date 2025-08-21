type OrderType = 'Diproses' | 'Selesai' | 'Siap Diambil'

interface IOrderCardProps {
    type: OrderType
    data: IOngoingOrder
    message?: string
    idx: number
    openConfirmationDialog?: () => void
}

type RootStackParamList = {
    Login: undefined
    Register: undefined
    ChoosePlan: undefined
    Main: undefined
    OrderDetails: { orderId: string }
    CustomerForm: { customerId?: string }
    ServiceForm: { serviceId?: string }
    DurationForm: { durationId?: string }
    Payment: { invoice: string }
    Receipt: { invoice: string }
    SubscriptionPayment: { invoice: string }
    WaitingConfirmation: undefined
}
