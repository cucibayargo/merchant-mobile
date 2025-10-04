import { IOrderService } from '@/types/order'
import React, { createContext, ReactNode, useContext, useState } from 'react'

export interface ICreateOrderData {
    customer_id: string
    customer_name: string
    customer_phone_number: string
    customer_address: string
    duration_id: string
    duration_name: string
    note: string
    services: IOrderService[]
    estimated_date: string
    payment_status: string
}

export interface ICreateOrderContext {
    orderData: ICreateOrderData
    setOrderData: React.Dispatch<React.SetStateAction<ICreateOrderData>>
    updateCustomer: (customer: {
        id: string
        name: string
        phone: string
        address: string
    }) => void
    updateDuration: (duration: { id: string; name: string }) => void
    addService: (service: IOrderService) => void
    removeService: (serviceId: string) => void
    updateServiceQuantity: (serviceId: string, quantity: number) => void
    clearAllServices: () => void
    updateNote: (note: string) => void
    updateEstimatedDate: (date: string) => void
    updatePaymentStatus: (status: string) => void
    getTotalAmount: () => number
    resetOrder: () => void
}

const initialOrderData: ICreateOrderData = {
    customer_id: '',
    customer_name: '',
    customer_phone_number: '',
    customer_address: '',
    duration_id: '',
    duration_name: '',
    note: '',
    services: [],
    estimated_date: '',
    payment_status: 'Belum Dibayar',
}

const CreateOrderContext = createContext<ICreateOrderContext | undefined>(
    undefined
)

export const useCreateOrder = (): ICreateOrderContext => {
    const context = useContext(CreateOrderContext)
    if (!context) {
        throw new Error(
            'useCreateOrder must be used within a CreateOrderProvider'
        )
    }
    return context
}

interface CreateOrderProviderProps {
    children: ReactNode
}

export const CreateOrderProvider: React.FC<CreateOrderProviderProps> = ({
    children,
}) => {
    const [orderData, setOrderData] =
        useState<ICreateOrderData>(initialOrderData)

    const updateCustomer = (customer: {
        id: string
        name: string
        phone: string
        address: string
    }) => {
        setOrderData((prev) => ({
            ...prev,
            customer_id: customer.id,
            customer_name: customer.name,
            customer_phone_number: customer.phone,
            customer_address: customer.address,
        }))
    }

    const updateDuration = (duration: { id: string; name: string }) => {
        setOrderData((prev) => ({
            ...prev,
            duration_id: duration.id,
            duration_name: duration.name,
        }))
    }

    const addService = (service: IOrderService) => {
        setOrderData((prev) => ({
            ...prev,
            services: [...prev.services, service],
        }))
    }

    const removeService = (serviceId: string) => {
        setOrderData((prev) => ({
            ...prev,
            services: prev.services.filter(
                (service) => service.service_id !== serviceId
            ),
        }))
    }

    const updateServiceQuantity = (serviceId: string, quantity: number) => {
        setOrderData((prev) => ({
            ...prev,
            services: prev.services.map((service) =>
                service.service_id === serviceId
                    ? { ...service, quantity }
                    : service
            ),
        }))
    }

    const clearAllServices = () => {
        setOrderData((prev) => ({
            ...prev,
            services: [],
        }))
    }

    const updateNote = (note: string) => {
        setOrderData((prev) => ({ ...prev, note }))
    }

    const updateEstimatedDate = (date: string) => {
        setOrderData((prev) => ({ ...prev, estimated_date: date }))
    }

    const updatePaymentStatus = (status: string) => {
        setOrderData((prev) => ({ ...prev, payment_status: status }))
    }

    const getTotalAmount = (): number => {
        return orderData.services.reduce((total, service) => {
            return total + service.price * service.quantity
        }, 0)
    }

    const resetOrder = () => {
        setOrderData(initialOrderData)
    }

    const value: ICreateOrderContext = {
        orderData,
        setOrderData,
        updateCustomer,
        updateDuration,
        addService,
        removeService,
        updateServiceQuantity,
        clearAllServices,
        updateNote,
        updateEstimatedDate,
        updatePaymentStatus,
        getTotalAmount,
        resetOrder,
    }

    return (
        <CreateOrderContext.Provider value={value}>
            {children}
        </CreateOrderContext.Provider>
    )
}
