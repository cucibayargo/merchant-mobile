interface OrderListProps {
    tab: OrderType
    orders: IOngoingOrder[]
    onChangeTab: (tab: OrderType) => void
    onRefresh: () => void
}
