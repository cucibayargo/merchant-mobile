import CustomSearchBar from '@/components/customSearchBar'
import { BreadcrumbContext } from '@/context/breadcrumb'
import useDeleteService from '@/hooks/service/useDeleteService'
import useGetServices from '@/hooks/service/useGetServices'
import { IService } from '@/types/service'
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

interface IDuration {
    id: string
    name: string
    duration: number
    type: string
}

type GetDurationResponse = {
    durations: IDuration[]
    isLastPage: boolean
    isFirstPage: boolean
}

export default function DurationIndex() {
    const { setTitle, setShowBackIcon, setPrevPath, setShowTitle } =
        useContext(BreadcrumbContext)
    const router = useRouter()

    const [filter, setFilter] = useState<string>('')
    const [page, setPage] = useState<number>(1)
    const limit: number = 10

    const [services, setServices] = useState<IService[]>([])
    const [isLastPage, setIsLastPage] = useState<boolean>(false)
    const [isFirstPage, setIsFirstPage] = useState<boolean>(true)
    const [loadingMore, setLoadingMore] = useState<boolean>(false)
    const { data, isLoading, refetch, isRefetching } = useGetServices({
        filter,
        limit,
        page,
    })
    const { mutateAsync: deleteService, isSuccess: isDeleteSuccess } =
        useDeleteService()

    useEffect(() => {
        setShowTitle(true)
        setTitle('Durasi')
        setShowBackIcon(true)
        setPrevPath('settings')
    }, [])

    useEffect(() => {
        if (data) {
            setServices(
                page === 1
                    ? data?.data.services
                    : [...services, ...data?.data.services]
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
        if (isDeleteSuccess) {
            refetch()
        }
    }, [isDeleteSuccess])

    const loadMore = () => {
        if (loadingMore || isLastPage) return
        setLoadingMore(true)
        setPage((p) => p + 1)
    }

    const navigateToCreate = () =>
        router.push({ pathname: '/service/create' } as never)

    const navigateToDetail = (id: string) =>
        router.push({
            pathname: '/service/[id]',
            params: { id },
        } as never)

    const confirmDelete = useCallback((service: IService) => {
        Alert.alert(
            'Hapus Layanan?',
            `Anda yakin menghapus layanan ${service.name}`,
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: () => deleteService(service.id),
                },
            ]
        )
    }, [])

    const renderItem = ({ item }: { item: IService }) => (
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
                    <Text style={{ fontWeight: '600', marginBottom: 5 }}>
                        {item.name}
                    </Text>

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
        <SafeAreaView
            className="flex-1 bg-white"
            style={{ backgroundColor: '#f0eeeb' }}
        >
            <View className="px-4 pt-4">
                <CustomSearchBar
                    placeholder="Cari layanan..."
                    query={filter}
                    onSearch={setFilter}
                />

                {(isLoading || (isRefetching && page === 1)) && (
                    <View className="mt-6">
                        <ActivityIndicator />
                    </View>
                )}

                {!isLoading && services.length === 0 ? (
                    <Text className="text-center mt-6">Tidak Ada Durasi</Text>
                ) : (
                    <FlatList
                        className="mt-4"
                        data={services}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        onEndReachedThreshold={0.5}
                        onEndReached={loadMore}
                        ListFooterComponent={
                            loadingMore && !isLastPage ? (
                                <View className="py-4">
                                    <ActivityIndicator />
                                </View>
                            ) : null
                        }
                    />
                )}
            </View>

            <View className="absolute bottom-10 right-6">
                <TouchableOpacity
                    className="bg-blue-600 rounded-full w-12 h-12 items-center justify-center"
                    onPress={navigateToCreate}
                >
                    <Text className="text-white text-2xl">＋</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
