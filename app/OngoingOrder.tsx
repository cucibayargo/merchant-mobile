import React, { useState, useEffect } from 'react'
import {
    View,
    StyleSheet,
    FlatList,
    RefreshControl,
    Alert,
    TextInput,
} from 'react-native'
import {
    Text,
    Card,
    Button,
    FAB,
    Chip,
    useTheme,
    ActivityIndicator,
} from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import useGetOrders from '@/hooks/order/useGetOrders'
import OrderCard from '@/components/orderCard'

const OngoingOrder = () => {
    const [refreshing, setRefreshing] = useState(false)
    const navigation = useNavigation()
    const theme = useTheme()
    const [filter, setFilter] = useState<string>('')
    const limit: number = 10
    const [page, setPage] = useState(1)
    const { data, isLoading, refetch, isError } = useGetOrders({
        status: 'Diproses',
        filter,
        limit,
        page,
    })
    const [orders, setOrders] = useState<IOngoingOrder[]>([])
    const [confirmationDialogCounter, setConfirmationDialogCounter] =
        useState<number>(0)
    const [selectedInvoiceForUpdate, setSelectedInvoiceForUpdate] =
        useState<string>('')

    useEffect(() => {
        if (data) {
            setOrders(data?.data?.transactions)
            // if (isFetchedMore) {
            //     if (orders?.length) {
            //         setOrders([...orders, ...data?.data?.transactions]);
            //     } else {
            //         setOrders(data?.data?.transactions);
            //     }
            // } else {
            //     setOrders(data?.data?.transactions);
            // }
            //
            // setLoadingMore(false);
            //
            // if (!isFetchedMore) {
            //     window.scrollTo(0, 0);
            // }
        }
    }, [data])

    const onRefresh = async () => {
        setRefreshing(true)
        await refetch()
        setRefreshing(false)
    }

    const changeFilterHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || (e.target as HTMLInputElement).value === '') {
            setFilter((e.target as HTMLInputElement).value)
            setPage(1)
            // setIsFetchedMore(false);
        }
    }

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text>Loading orders...</Text>
            </View>
        )
    }

    if (isError) {
        return (
            <View style={styles.errorContainer}>
                <Text>Error loading orders</Text>
                <Button mode="contained" onPress={() => refetch()}>
                    Retry
                </Button>
            </View>
        )
    }

    return (
        <View className={'flex-1 bg-gray-100'}>
            <View className={'bg-white sticky w-full p-4 mb-2 z-50'}>
                <TextInput
                    placeholder="Pencarian No Nota & Nama..."
                    value={filter}
                    onChangeText={setFilter}
                    // onKeyPress={changeFilterHandler}
                />
            </View>

            <FlatList
                data={orders}
                renderItem={({
                    item,
                }: {
                    item: IOngoingOrder
                    index: number
                }) => (
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
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListEmptyComponent={
                    <View
                        className={'flex-1 justify-center items-center py-10'}
                    >
                        <Text variant="bodyLarge">No ongoing orders</Text>
                        <Text variant="bodyMedium" style={styles.emptySubtitle}>
                            Orders will appear here when they are created
                        </Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                className={
                    'absolute bottom-0 right-0 m-4 bg-water-4 rounded-full'
                }
                onPress={() => navigation.navigate('ChooseService' as never)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    subtitle: {
        marginTop: 4,
        opacity: 0.7,
    },
    listContainer: {
        padding: 16,
    },
    card: {
        marginBottom: 12,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    statusChip: {
        height: 24,
    },
    serviceName: {
        marginBottom: 8,
        opacity: 0.8,
    },
    orderDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    date: {
        opacity: 0.6,
    },
    total: {
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptySubtitle: {
        marginTop: 8,
        opacity: 0.6,
        textAlign: 'center',
    },
    // fab: {
    //     position: 'absolute',
    //     margin: 16,
    //     right: 0,
    //     bottom: 0,
    // },
})

export default OngoingOrder
