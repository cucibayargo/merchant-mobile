interface IPricingPlan {
    title: string
    value: string
    features: string[]
    price: string
    discount?: number
    priceDiscount?: string
    isPopular: boolean
}
