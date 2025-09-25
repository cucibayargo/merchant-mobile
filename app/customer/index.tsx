import CustomSearchBar from '@/components/customSearchBar'
import { BreadcrumbContext } from '@/context/breadcrumb'
import { useRouter } from 'expo-router'
import { Trash2 } from 'lucide-react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    FlatList,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { Card } from 'react-native-paper'
import useDeleteCustomer from '@/hooks/customer/useDeleteCustomer'
import useGetCustomers from '@/hooks/customer/useGetCustomers'
import { ICustomer } from '@/types/customer'

export default function CustomerIndex() {
    const { setTitle, setShowBackIcon, setPrevPath, setShowTitle } =
        useContext(BreadcrumbContext)
    const router = useRouter()

    const [filter, setFilter] = useState<string>('')
    const [page, setPage] = useState<number>(1)
    const limit: number = 10

    const [customers, setCustomers] = useState<ICustomer[]>([])
    const [isLastPage, setIsLastPage] = useState<boolean>(false)
    const [isFirstPage, setIsFirstPage] = useState<boolean>(true)
    const [loadingMore, setLoadingMore] = useState<boolean>(false)
    const {
        mutateAsync: deleteCustomer,
        isSuccess: isDeleteCustomerSuccess,
        isPending: isDeleteCustomerPending,
    } = useDeleteCustomer()

    useEffect(() => {
        setShowTitle(true)
        setTitle('Durasi')
        setShowBackIcon(true)
        setPrevPath('settings')
    }, [])

    const { data, isLoading, refetch, isRefetching } = useGetCustomers({
        filter,
        page,
        limit,
    })

    useEffect(() => {
        if (data) {
            setCustomers(
                page === 1
                    ? data.data.customers
                    : [...customers, ...data.data.customers]
            )
            setLoadingMore(false)
            setIsLastPage(data.data.isLastPage)
            setIsFirstPage(data.data.isFirstPage)

            if (page !== 1) {
                window.scrollTo(0, 0)
            }
        }
    }, [data])

    useEffect(() => {
        if (isDeleteCustomerSuccess) {
            refetch()
        }
    }, [isDeleteCustomerSuccess])

    const loadMore = () => {
        if (loadingMore || isLastPage) return
        setLoadingMore(true)
        setPage((p) => p + 1)
    }

    const navigateToCreate = () =>
        router.push({ pathname: '/customer/create' } as never)

    const navigateToDetail = (id: string) =>
        router.push({
            pathname: '/customer/[id]',
            params: { id },
        } as never)

    const confirmDelete = useCallback((customer: ICustomer) => {
        Alert.alert(
            'Hapus Pelanggan?',
            `Anda yakin menghapus pelanggan ${customer.name}`,
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: () => deleteCustomer(customer.id),
                },
            ]
        )
    }, [])

    const renderItem = ({ item }: { item: ICustomer }) => (
        <TouchableOpacity
            onPress={() => navigateToDetail(item.id)}
            style={{ marginBottom: 10 }}
        >
            <Card>
                <Card.Content
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}
                >
                    <View>
                        <Text style={{ fontWeight: '600', marginBottom: 5 }}>
                            {item.name}
                        </Text>
                        <Text>{item.phone_number}</Text>
                    </View>

                    <Trash2
                        color={'#a33929'}
                        style={{ marginVertical: 'auto' }}
                        onPress={() => confirmDelete(item)}
                    />
                </Card.Content>
            </Card>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView style={{ backgroundColor: '#f0eeeb', flex: 1 }}>
            <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                <CustomSearchBar
                    placeholder="Cari Pelanggan..."
                    query={filter}
                    onSearch={setFilter}
                />

                {(isLoading ||
                    isDeleteCustomerPending ||
                    (isRefetching && page === 1)) && (
                    <View style={{ marginTop: 24 }}>
                        <ActivityIndicator />
                    </View>
                )}

                {!isLoading && customers.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginTop: 24 }}>
                        Tidak Ada Durasi
                    </Text>
                ) : (
                    <FlatList
                        style={{ marginTop: 16 }}
                        data={customers}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        onEndReachedThreshold={0.5}
                        onEndReached={loadMore}
                        ListFooterComponent={
                            loadingMore && !isLastPage ? (
                                <View style={{ marginVertical: 16 }}>
                                    <ActivityIndicator />
                                </View>
                            ) : null
                        }
                    />
                )}
            </View>

            <View style={{ position: 'absolute', bottom: 60, right: 24 }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#2563eb',
                        borderRadius: 999,
                        width: 60,
                        height: 60,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    onPress={navigateToCreate}
                >
                    <Text
                        style={{
                            color: 'white',
                            fontSize: 30,
                            marginTop: -7,
                        }}
                    >
                        ＋
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
