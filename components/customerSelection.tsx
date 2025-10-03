import { ICustomer } from '@/types/customer'
import { MapPin, Phone, User2 } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, View } from 'react-native'
import { Text } from 'react-native-paper'
import CustomSearchBar from './customSearchBar'

interface CustomerSelectionProps {
    onCustomerSelect: (customer: ICustomer) => void
    customers: ICustomer[]
    isLoading: boolean
    onRefresh: () => void
    filter: string
    onFilterChange: (filter: string) => void
}

const CustomerSelection: React.FC<CustomerSelectionProps> = ({
    onCustomerSelect,
    customers,
    isLoading,
    onRefresh,
    filter,
    onFilterChange,
}) => {
    const [localFilter, setLocalFilter] = useState(filter)

    // Debounce the filter change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onFilterChange(localFilter)
        }, 500) // 300ms delay

        return () => clearTimeout(timeoutId)
    }, [localFilter, onFilterChange])

    // Update local filter when prop changes
    useEffect(() => {
        setLocalFilter(filter)
    }, [filter])

    const handleCustomerPress = (customer: ICustomer) => {
        onCustomerSelect(customer)
    }

    const CustomerCard = ({ customer }: { customer: ICustomer }) => (
        <Pressable
            onPress={() => handleCustomerPress(customer)}
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
                    alignItems: 'center',
                    marginBottom: 8,
                }}
            >
                <User2 color="#6B7280" size={18} />
                <Text
                    style={{ marginLeft: 8, fontWeight: '700', fontSize: 16 }}
                >
                    {customer.name}
                </Text>
            </View>

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 6,
                }}
            >
                <Phone color="#6B7280" size={16} />
                <Text style={{ marginLeft: 8, color: '#6B7280' }}>
                    {customer.phone_number}
                </Text>
            </View>

            {customer.address && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MapPin color="#6B7280" size={16} />
                    <Text style={{ marginLeft: 8, color: '#6B7280', flex: 1 }}>
                        {customer.address}
                    </Text>
                </View>
            )}
        </Pressable>
    )

    const EmptyState = () => (
        <View style={{ alignItems: 'center', paddingVertical: 32 }}>
            <User2 size={48} color="#9CA3AF" />
            <Text
                style={{ color: '#9CA3AF', marginTop: 12, textAlign: 'center' }}
            >
                {filter
                    ? 'Tidak ada customer yang ditemukan'
                    : 'Belum ada customer'}
            </Text>
        </View>
    )

    const LoadingState = () => (
        <View style={{ alignItems: 'center', paddingVertical: 32 }}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={{ color: '#6B7280', marginTop: 12 }}>
                Memuat customer...
            </Text>
        </View>
    )

    return (
        <View style={{}}>
            <CustomSearchBar
                placeholder="Cari nama atau nomor telepon..."
                query={localFilter}
                onSearch={setLocalFilter}
            />

            <View style={{ marginTop: 16, maxHeight: 480 }}>
                {isLoading ? (
                    <LoadingState />
                ) : (
                    <FlatList
                        data={customers}
                        renderItem={({ item }) => (
                            <CustomerCard customer={item} />
                        )}
                        keyExtractor={(item) => item.id}
                        ListEmptyComponent={EmptyState}
                        showsVerticalScrollIndicator={true}
                        onRefresh={onRefresh}
                        refreshing={isLoading}
                        contentContainerStyle={{ paddingBottom: 140 }}
                    />
                )}
            </View>
        </View>
    )
}

export default CustomerSelection
