import CustomSearchBar from '@/components/customSearchBar'
import { BreadcrumbContext } from '@/context/breadcrumb'
import useDeleteDuration from '@/hooks/duration/useDeleteDuration'
import useGetDuration from '@/hooks/duration/useGetDuration'
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

    const [durations, setDurations] = useState<IDuration[]>([])
    const [isLastPage, setIsLastPage] = useState<boolean>(false)
    const [isFirstPage, setIsFirstPage] = useState<boolean>(true)
    const [loadingMore, setLoadingMore] = useState<boolean>(false)
    const { mutateAsync: deleteDuration, isSuccess: isDeleteDurationSuccess } =
        useDeleteDuration()

    useEffect(() => {
        setShowTitle(true)
        setTitle('Durasi')
        setShowBackIcon(true)
        setPrevPath('settings')
    }, [])

    const { data, isLoading, refetch, isRefetching } = useGetDuration({
        filter,
        page,
        limit,
    })

    useEffect(() => {
        if (data) {
            setDurations(
                page === 1
                    ? data.data.durations
                    : [...durations, ...data.data.durations]
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
        if (isDeleteDurationSuccess) {
            refetch()
        }
    }, [isDeleteDurationSuccess])

    const loadMore = () => {
        if (loadingMore || isLastPage) return
        setLoadingMore(true)
        setPage((p) => p + 1)
    }

    const navigateToCreate = () =>
        router.push({ pathname: '/duration/create' } as never)

    const navigateToDetail = (id: string) =>
        router.push({
            pathname: '/duration/[id]',
            params: { id },
        } as never)

    const confirmDelete = useCallback((duration: IDuration) => {
        Alert.alert(
            'Hapus Durasi?',
            `Anda yakin menghapus durasi ${duration.name}`,
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: () => deleteDuration(duration.id),
                },
            ]
        )
    }, [])

    const renderItem = ({ item }: { item: IDuration }) => (
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
                        <Text>
                            {item.duration} {item.type}
                        </Text>
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
        <SafeAreaView
            className="flex-1 bg-white"
            style={{ backgroundColor: '#f0eeeb' }}
        >
            <View className="px-4 pt-4">
                <CustomSearchBar
                    placeholder="Cari durasi..."
                    query={filter}
                    onSearch={setFilter}
                />

                {(isLoading || (isRefetching && page === 1)) && (
                    <View className="mt-6">
                        <ActivityIndicator />
                    </View>
                )}

                {!isLoading && durations.length === 0 ? (
                    <Text className="text-center mt-6">Tidak Ada Durasi</Text>
                ) : (
                    <FlatList
                        className="mt-4"
                        data={durations}
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
