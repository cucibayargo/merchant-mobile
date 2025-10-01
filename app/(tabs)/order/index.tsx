// StatusTabs.tsx
import noDataIcon from '@/assets/images/no-data.png'
import CustomSearchBar from '@/components/customSearchBar'
import OrderCard from '@/components/orderCard'
import OrderCardSkeleton from '@/components/orderCard.skeleton'
import useGetOrders from '@/hooks/order/useGetOrders'
import { IOngoingOrder } from '@/types/order'
import { useIsFocused } from '@react-navigation/core'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React, { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native'

const TABS: { key: string; label: string }[] = [
    { key: 'Diproses', label: 'Proses' },
    { key: 'Siap Diambil', label: 'Siap Ambil' },
    { key: 'Selesai', label: 'Selesai' },
]

const EmptyState = () => {
    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
            }}
        >
            <Image
                source={noDataIcon}
                style={{
                    width: 240,
                    height: 160,
                    marginBottom: 24,
                    resizeMode: 'contain',
                }}
            />
            <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 6 }}>
                No Data
            </Text>
            <Text
                style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center' }}
            >
                Saat ini belum ada data yang dapat ditampilkan
            </Text>
        </View>
    )
}

const OrderList = ({ tab, orders, onChangeTab, onRefresh }: OrderListProps) => {
    const [confirmationDialogCounter, setConfirmationDialogCounter] =
        useState<number>(0)
    const [selectedInvoiceForUpdate, setSelectedInvoiceForUpdate] =
        useState<string>('')

    const [refreshing, setRefreshing] = React.useState(false)
    const refreshHandler = async () => {
        setRefreshing(true)
        onRefresh()
        setTimeout(() => setRefreshing(false), 600)
    }
    const isFocused = useIsFocused()

    useEffect(() => {
        if (isFocused) {
            onChangeTab(tab)
        }
    }, [isFocused, tab])

    return (
        <FlatList
            data={orders}
            renderItem={({ item }: { item: IOngoingOrder; index: number }) => (
                <OrderCard
                    idx={Number(item.id)}
                    type="Diproses"
                    data={item}
                    openConfirmationDialog={() => {
                        setConfirmationDialogCounter(
                            confirmationDialogCounter + 1
                        )
                        setSelectedInvoiceForUpdate(item.invoice)
                    }}
                />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
                paddingVertical: 10,
            }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refreshHandler}
                />
            }
            ListEmptyComponent={EmptyState}
        />
    )
}

const Loading = () => {
    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
            <ActivityIndicator size="large" />
        </View>
    )
}

const Tab = createMaterialTopTabNavigator()

const OrderIndex = () => {
    const [orders, setOrders] = useState<IOngoingOrder[]>([])
    const [filter, setFilter] = useState<string>('')
    const limit: number = 10
    const [page, setPage] = useState(1)
    const [status, setStatus] = useState<OrderType>('Diproses')
    const { data, refetch, isLoading, isRefetching } = useGetOrders({
        status,
        filter,
        limit,
        page,
    })

    useEffect(() => {
        if (data) {
            setOrders(data?.data?.transactions)
        }
    }, [data])

    const changeTabHandler = (tab: OrderType) => {
        setStatus(tab)
        setPage(1)
    }

    return (
        <Tab.Navigator
            screenOptions={{
                swipeEnabled: true,
                lazy: true,
                lazyPreloadDistance: 1,
                tabBarScrollEnabled: true,
                tabBarIndicatorStyle: {
                    backgroundColor: '#ff3b30',
                    height: 3,
                    borderRadius: 2,
                },
                tabBarActiveTintColor: '#111827',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarItemStyle: { width: 'auto' },
                tabBarLabelStyle: {
                    fontWeight: '700',
                    textTransform: 'none',
                },
                tabBarStyle: {
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
            }}
        >
            {TABS.map((t) => (
                <Tab.Screen
                    key={t.key}
                    name={t.label}
                    options={{ lazyPlaceholder: () => <Loading /> }}
                    children={() => (
                        <View
                            style={{
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                backgroundColor: '#fff',
                                flex: 1,
                            }}
                        >
                            <View className="mt-7">
                                <CustomSearchBar
                                    placeholder="Cari order..."
                                    query={filter}
                                    onSearch={setFilter}
                                />
                            </View>

                            {isLoading || isRefetching ? (
                                <View style={{ paddingVertical: 10 }}>
                                    {[...Array(6)].map((_, i) => (
                                        <OrderCardSkeleton
                                            key={`order-skeleton-${i}`}
                                        />
                                    ))}
                                </View>
                            ) : (
                                <OrderList
                                    tab={t.key as OrderType}
                                    orders={orders}
                                    onChangeTab={changeTabHandler}
                                    onRefresh={refetch}
                                />
                            )}
                        </View>
                    )}
                />
            ))}
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        marginTop: 10,
        marginHorizontal: 10,
        backgroundColor: '#fff',
        height: 10,
    },
})

export default OrderIndex
