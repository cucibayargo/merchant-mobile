import { IServiceDetail } from '@/types/service'
import { Minus, Plus, Search } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    TextInput,
    View,
} from 'react-native'
import { Text } from 'react-native-paper'
import CustomSearchBar from './customSearchBar'

interface ServiceSelectionProps {
    onSaveServices: (selectedServices: {
        [key: string]: { service: IServiceDetail; quantity: number }
    }) => void
    services: IServiceDetail[]
    isLoading: boolean
    onRefresh: () => void
    filter: string
    onFilterChange: (filter: string) => void
    currentOrderServices?: { [key: string]: number } // service_id -> quantity
}

const ServiceSelection: React.FC<ServiceSelectionProps> = ({
    onSaveServices,
    services,
    isLoading,
    onRefresh,
    filter,
    onFilterChange,
    currentOrderServices = {},
}) => {
    const [localFilter, setLocalFilter] = useState(filter)
    const [selectedServices, setSelectedServices] = useState<{
        [key: string]: { service: IServiceDetail; quantity: number }
    }>({})

    // Initialize selected services with current order services
    useEffect(() => {
        const initialServices: {
            [key: string]: { service: IServiceDetail; quantity: number }
        } = {}

        // Map current order services to selected services
        Object.entries(currentOrderServices).forEach(
            ([serviceId, quantity]) => {
                const service = services.find((s) => s.id === serviceId)
                if (service) {
                    initialServices[serviceId] = { service, quantity }
                }
            }
        )

        setSelectedServices(initialServices)
    }, [services, currentOrderServices])

    // Debounce the filter change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onFilterChange(localFilter)
        }, 500) // 500ms delay

        return () => clearTimeout(timeoutId)
    }, [localFilter, onFilterChange])

    // Update local filter when prop changes
    useEffect(() => {
        setLocalFilter(filter)
    }, [filter])

    const handleQuantityChange = (serviceId: string, newQuantity: number) => {
        if (newQuantity < 0) return

        // Find the service to get its details
        const service = services.find((s) => s.id === serviceId)
        if (!service) return

        if (newQuantity === 0) {
            // Remove service if quantity is 0
            setSelectedServices((prev) => {
                const newState = { ...prev }
                delete newState[serviceId]
                return newState
            })
        } else {
            // Add or update service
            setSelectedServices((prev) => ({
                ...prev,
                [serviceId]: { service, quantity: newQuantity },
            }))
        }
    }

    const handleSaveServices = () => {
        onSaveServices(selectedServices)
        setSelectedServices({})
    }

    const ServiceCard = ({ service }: { service: IServiceDetail }) => {
        const quantity = selectedServices[service.id]?.quantity || 0

        return (
            <Pressable
                style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                    }}
                >
                    <View style={{ flex: 1, marginRight: 12 }}>
                        <Text
                            style={{
                                fontWeight: '700',
                                fontSize: 16,
                                marginBottom: 4,
                            }}
                        >
                            {service.name}
                        </Text>
                        <Text style={{ color: '#6B7280', fontSize: 14 }}>
                            Satuan: {service.unit}
                        </Text>

                        {/* Quantity Controls */}
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 12,
                                justifyContent: 'space-between',
                            }}
                        >
                            <Text
                                style={{
                                    color: '#6B7280',
                                    fontSize: 14,
                                    marginRight: 8,
                                }}
                            >
                                Jumlah:
                            </Text>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                {/* Minus Button */}
                                <Pressable
                                    onPress={() =>
                                        handleQuantityChange(
                                            service.id,
                                            quantity - 1
                                        )
                                    }
                                    style={{
                                        backgroundColor: '#F3F4F6',
                                        borderRadius: 6,
                                        width: 32,
                                        height: 32,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Minus size={16} color="#6B7280" />
                                </Pressable>

                                {/* Quantity Input */}
                                <TextInput
                                    value={quantity.toString()}
                                    onChangeText={(text) => {
                                        const num = parseInt(text) || 0
                                        handleQuantityChange(service.id, num)
                                    }}
                                    style={{
                                        borderWidth: 1,
                                        borderColor: '#D1D5DB',
                                        borderRadius: 6,
                                        paddingHorizontal: 8,
                                        paddingVertical: 6,
                                        marginHorizontal: 8,
                                        minWidth: 50,
                                        textAlign: 'center',
                                        fontSize: 14,
                                        fontWeight: '500',
                                    }}
                                    keyboardType="numeric"
                                />

                                {/* Plus Button */}
                                <Pressable
                                    onPress={() =>
                                        handleQuantityChange(
                                            service.id,
                                            quantity + 1
                                        )
                                    }
                                    style={{
                                        backgroundColor: '#F3F4F6',
                                        borderRadius: 6,
                                        width: 32,
                                        height: 32,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Plus size={16} color="#6B7280" />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </Pressable>
        )
    }

    const EmptyState = () => (
        <View style={{ alignItems: 'center', paddingVertical: 32 }}>
            <Search size={48} color="#9CA3AF" />
            <Text
                style={{ color: '#9CA3AF', marginTop: 12, textAlign: 'center' }}
            >
                {filter
                    ? 'Tidak ada layanan yang ditemukan'
                    : 'Belum ada layanan'}
            </Text>
        </View>
    )

    const LoadingState = () => (
        <View style={{ alignItems: 'center', paddingVertical: 32 }}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={{ color: '#6B7280', marginTop: 12 }}>
                Memuat layanan...
            </Text>
        </View>
    )

    const selectedCount = Object.keys(selectedServices).length

    return (
        <View>
            <CustomSearchBar
                placeholder="Cari nama layanan..."
                query={localFilter}
                onSearch={setLocalFilter}
            />

            <View style={{ marginTop: 16, height: 530 }}>
                {isLoading ? (
                    <LoadingState />
                ) : (
                    <FlatList
                        data={services}
                        renderItem={({ item }) => (
                            <ServiceCard service={item} />
                        )}
                        keyExtractor={(item) => item.id}
                        ListEmptyComponent={EmptyState}
                        showsVerticalScrollIndicator={true}
                        onRefresh={onRefresh}
                        refreshing={isLoading}
                    />
                )}
            </View>

            {/* Save Button */}
            <View
                style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderTopWidth: 1,
                    borderColor: '#E5E7EB',
                    backgroundColor: '#ffffff',
                    marginTop: 'auto',
                }}
            >
                <Pressable
                    onPress={handleSaveServices}
                    disabled={selectedCount === 0}
                    style={{
                        backgroundColor:
                            selectedCount > 0 ? '#3B82F6' : '#E5E7EB',
                        borderRadius: 12,
                        paddingVertical: 16,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            color: selectedCount > 0 ? 'white' : '#9CA3AF',
                            fontWeight: '600',
                            fontSize: 16,
                        }}
                    >
                        Simpan
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

export default ServiceSelection
