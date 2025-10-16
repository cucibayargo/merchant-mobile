import { BottomDrawer } from '@/components/bottomDrawer'
import CustomerSelection from '@/components/customerSelection'
import ServiceSelection from '@/components/serviceSelection'
import { useCreateOrder } from '@/context/createOrder'
import useGetCustomers from '@/hooks/customer/useGetCustomers'
import useGetServiceList from '@/hooks/service/useGetServiceList'
import { IServiceOrder } from '@/types/createOrder'
import { ICustomer } from '@/types/customer'
import { useFocusEffect } from '@react-navigation/native'
import { Edit, MapPin, Pencil, Phone, Plus, User2 } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView, TextInput, View } from 'react-native'
import { Text } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const CreateOrder = () => {
    const insets = useSafeAreaInsets()
    const {
        orderData,
        updateCustomer,
        addService,
        clearAllServices,
        updateNote,
        getTotalAmount,
    } = useCreateOrder()
    const [showCustomerDrawer, setShowCustomerDrawer] = useState(false)
    const [showServiceDrawer, setShowServiceDrawer] = useState(false)
    const [filter, setFilter] = useState('')
    const [serviceFilter, setServiceFilter] = useState('')
    const [customers, setCustomers] = useState<ICustomer[]>([])
    const [services, setServices] = useState<IServiceOrder[]>([])

    const { data, isLoading, refetch } = useGetCustomers({
        filter,
        limit: 20,
        page: 1,
    })

    const {
        data: serviceData,
        isLoading: isServiceLoading,
        refetch: refetchServices,
    } = useGetServiceList({
        filter: serviceFilter,
        limit: 20,
        page: 1,
    })

    useEffect(() => {
        if (data?.data?.customers) {
            setCustomers(data.data.customers)
        }
    }, [data])

    useEffect(() => {
        if (serviceData?.data) {
            setServices(serviceData.data)
        }
    }, [serviceData])

    // Show customer selection drawer when screen comes into focus and no customer is selected
    useFocusEffect(
        React.useCallback(() => {
            if (!orderData.customer_id) {
                setShowCustomerDrawer(true)
            }
        }, [orderData.customer_id])
    )

    return (
        <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            <ScrollView
                contentContainerStyle={{
                    padding: 16,
                    paddingTop: (insets.top || 0) + 20,
                    paddingBottom: 100, // Fixed padding for summary bar
                }}
            >
                {/* Customer card */}
                <View
                    style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 16,
                        shadowColor: '#000',
                        shadowOpacity: 0.04,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <User2 color="#6B7280" size={18} />
                            <Text style={{ marginLeft: 8 }}>
                                {orderData.customer_name || 'Pilih Customer'}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 8,
                            }}
                        >
                            <Phone color="#6B7280" size={18} />
                            <Text style={{ marginLeft: 8 }}>
                                {orderData.customer_phone_number || 'No phone'}
                            </Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 6,
                            }}
                        >
                            <MapPin color="#6B7280" size={18} />
                            <Text style={{ marginLeft: 8, color: '#6B7280' }}>
                                {orderData.customer_address ||
                                    'Tidak ada alamat'}
                            </Text>
                        </View>
                    </View>

                    <Pressable
                        onPress={() => setShowCustomerDrawer(true)}
                        hitSlop={8}
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            backgroundColor: '#3B82F6',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginVertical: 'auto',
                        }}
                    >
                        <Pencil size={20} color="#ffffff" />
                    </Pressable>
                </View>

                {/* Items */}
                <View
                    style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 12,
                        padding: 12,
                        marginBottom: 16,
                        shadowColor: '#000',
                        shadowOpacity: 0.04,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 1,
                    }}
                >
                    {orderData.services.length > 0 ? (
                        <>
                            {orderData.services.map((it, idx) => (
                                <View
                                    key={it.id}
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        paddingVertical: 12,
                                        borderBottomWidth:
                                            idx !==
                                            orderData.services.length - 1
                                                ? 1
                                                : 0,
                                        borderColor: '#F3F4F6',
                                    }}
                                >
                                    <View style={{ maxWidth: '70%' }}>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '700',
                                            }}
                                        >
                                            {it.name}
                                        </Text>
                                        <Text
                                            style={{
                                                color: '#6B7280',
                                                marginTop: 2,
                                            }}
                                        >
                                            {it.duration_name || 'No duration'}{' '}
                                            x Rp{' '}
                                            {it.price.toLocaleString('id-ID')}
                                        </Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={{ color: '#6B7280' }}>
                                            Qty
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                fontWeight: '700',
                                            }}
                                        >
                                            {it.quantity} {it.unit}
                                        </Text>
                                        <Text style={{ marginTop: 4 }}>
                                            Rp{' '}
                                            {(
                                                it.price * it.quantity
                                            ).toLocaleString('id-ID')}
                                        </Text>
                                    </View>
                                </View>
                            ))}

                            {/* Edit Services Button */}
                            <Pressable
                                onPress={() => setShowServiceDrawer(true)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingVertical: 12,
                                    marginTop: 8,
                                    borderTopWidth: 1,
                                    borderColor: '#E5E7EB',
                                }}
                            >
                                <Edit size={16} color="#6B7280" />
                                <Text
                                    style={{
                                        color: '#6B7280',
                                        marginLeft: 8,
                                        fontWeight: '500',
                                    }}
                                >
                                    Edit Layanan
                                </Text>
                            </Pressable>
                        </>
                    ) : (
                        <Pressable
                            onPress={() => setShowServiceDrawer(true)}
                            style={{
                                alignItems: 'center',
                                paddingVertical: 32,
                            }}
                        >
                            <Plus size={40} color="#6B7280" />
                            <Text style={{ color: '#6B7280', marginTop: 8 }}>
                                Tambah layanan
                            </Text>
                        </Pressable>
                    )}
                </View>

                {/* Note Input Section */}
                <View
                    style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 16,
                        shadowColor: '#000',
                        shadowOpacity: 0.04,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 1,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: '700',
                            marginBottom: 12,
                        }}
                    >
                        Catatan
                    </Text>
                    <TextInput
                        value={orderData.note}
                        onChangeText={updateNote}
                        placeholder="Tambahkan catatan untuk pesanan..."
                        multiline
                        numberOfLines={3}
                        style={{
                            backgroundColor: '#f9fafb',
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: '#E5E7EB',
                            paddingHorizontal: 12,
                            paddingVertical: 10,
                            fontSize: 14,
                            textAlignVertical: 'top',
                            minHeight: 80,
                        }}
                    />
                </View>

                {/* Sticky bottom summary bar */}
                <View
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: insets.bottom || 0,
                        backgroundColor: '#ffffff',
                        paddingHorizontal: 16,
                        paddingTop: 12,
                        paddingBottom: 16,
                        borderTopWidth: 1,
                        borderColor: '#E5E7EB',
                        shadowColor: '#000',
                        shadowOpacity: 0.15,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: -4 },
                        elevation: 12,
                        zIndex: 1000,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <View>
                            <Text style={{ color: '#6B7280', fontSize: 12 }}>
                                Total
                            </Text>
                            <Text style={{ fontSize: 18, fontWeight: '700' }}>
                                Rp {getTotalAmount().toLocaleString('id-ID')}
                            </Text>
                        </View>

                        <Pressable
                            onPress={() => {
                                /* handle create order */
                            }}
                            style={{
                                backgroundColor: '#3B82F6',
                                paddingHorizontal: 24,
                                paddingVertical: 12,
                                borderRadius: 8,
                            }}
                        >
                            <Text
                                style={{ color: '#ffffff', fontWeight: '700' }}
                            >
                                Buat Pesanan
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>

            {/* Customer Selection Bottom Drawer */}
            <BottomDrawer
                open={showCustomerDrawer}
                onClose={() => {
                    setShowCustomerDrawer(false)
                    setFilter('') // Clear filter when closing
                }}
                height={880}
            >
                <CustomerSelection
                    onCustomerSelect={(customer: ICustomer) => {
                        updateCustomer({
                            id: customer.id,
                            name: customer.name,
                            phone: customer.phone_number,
                            address: customer.address || '',
                        })
                        setShowCustomerDrawer(false)
                    }}
                    customers={customers}
                    isLoading={isLoading}
                    onRefresh={refetch}
                    filter={filter}
                    onFilterChange={setFilter}
                />
            </BottomDrawer>

            {/* Service Selection Bottom Drawer */}
            <BottomDrawer
                open={showServiceDrawer}
                onClose={() => {
                    setShowServiceDrawer(false)
                    setServiceFilter('') // Clear filter when closing
                }}
                height={880}
            >
                <ServiceSelection
                    onSaveServices={(selectedServices) => {
                        // Clear existing services first
                        clearAllServices()

                        // Add all selected services
                        Object.values(selectedServices).forEach(
                            ({ service, quantity }) => {
                                addService({
                                    id: service.id,
                                    name: service.name,
                                    unit: service.unit,
                                    price: service.price,
                                    quantity: quantity,
                                    duration_id: service.duration_id,
                                    duration_name: service.duration_name,
                                })
                            }
                        )

                        setShowServiceDrawer(false)
                    }}
                    services={services}
                    isLoading={isServiceLoading}
                    onRefresh={refetchServices}
                    filter={serviceFilter}
                    onFilterChange={setServiceFilter}
                    currentOrderServices={orderData.services.reduce(
                        (acc, service) => {
                            acc[`${service.id}-${service.duration_id}`] =
                                service.quantity
                            return acc
                        },
                        {} as { [key: string]: number }
                    )}
                />
            </BottomDrawer>
        </View>
    )
}

export default CreateOrder
