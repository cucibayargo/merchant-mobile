import { BreadcrumbContext } from '@/context/breadcrumb'
import axiosInstance from '@/libs/axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    FlatList,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { DeleteIcon } from 'lucide-react'

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

    useEffect(() => {
        setShowTitle(true)
        setTitle('Durasi')
        setShowBackIcon(true)
        setPrevPath('settings')
    }, [])

    const fetchDurations = async (): Promise<GetDurationResponse> => {
        const res = await axiosInstance.get('/duration', {
            params: { filter, page, limit },
        })

        const payload = (res.data?.data ?? res.data) as GetDurationResponse
        return {
            durations: payload.durations ?? [],
            isLastPage: Boolean(payload.isLastPage),
            isFirstPage: Boolean(payload.isFirstPage),
        }
    }

    const { data, isLoading, refetch, isFetching } = useQuery({
        queryKey: ['durations', { filter, page, limit }],
        queryFn: fetchDurations,
    })

    const deleteMutation = useMutation({
        mutationKey: ['deleteDuration'],
        mutationFn: async (id: string) =>
            axiosInstance.delete(`/duration/${id}`),
        onSuccess: () => {
            setPage(1)
            refetch()
        },
    })

    useEffect(() => {
        if (!data) return
        if (page === 1) {
            setDurations(data.durations)
        } else {
            setDurations((prev) => [...prev, ...data.durations])
        }
        setIsLastPage(data.isLastPage)
        setIsFirstPage(data.isFirstPage)
        setLoadingMore(false)
    }, [data])

    const onSubmitSearch = () => {
        setPage(1)
        refetch()
    }

    const loadMore = () => {
        if (loadingMore || isLastPage) return
        setLoadingMore(true)
        setPage((p) => p + 1)
    }

    const navigateToCreate = () =>
        router.push({ pathname: '/settings/duration/create' } as never)

    const navigateToDetail = (id: string) =>
        router.push({
            pathname: '/settings/duration/[id]',
            params: { id },
        } as never)

    const confirmDelete = useCallback((id: string) => {
        Alert.alert('Hapus Durasi?', 'Tindakan ini tidak dapat dibatalkan.', [
            { text: 'Batal', style: 'cancel' },
            {
                text: 'Hapus',
                style: 'destructive',
                onPress: () => deleteMutation.mutate(id),
            },
        ])
    }, [])

    const renderItem = ({ item }: { item: IDuration }) => (
        <View className="flex-row items-center justify-between border border-gray-400 rounded mb-2 px-3 py-3 bg-white">
            <TouchableOpacity
                className="flex-1 mr-3"
                onPress={() => navigateToDetail(item.id)}
            >
                <Text className="font-bold">{item.name}</Text>
                <Text className="text-[10px]">
                    {item.duration} {item.type}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                {/*<DeleteIcon />*/}
            </TouchableOpacity>
        </View>
    )

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="px-4 pt-4">
                <TextInput
                    placeholder="Pencarian"
                    className="border rounded px-3 py-2"
                    value={filter}
                    onChangeText={setFilter}
                    onSubmitEditing={onSubmitSearch}
                    returnKeyType="search"
                />

                {(isLoading || (isFetching && page === 1)) && (
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
