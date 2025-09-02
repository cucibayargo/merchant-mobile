import axiosInstance from '@/libs/axios'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native'

interface IDuration {
    id: string
    name: string
    duration: number
    type: string
}

export default function DurationDetail() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(true)
    const [item, setItem] = useState<IDuration | null>(null)

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axiosInstance.get(`/duration/${id}`)
                const payload = (res.data?.data ?? res.data) as IDuration
                setItem(payload)
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [id])

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator />
            </SafeAreaView>
        )
    }

    if (!item) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <Text>Data tidak ditemukan</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="p-4">
                <Text className="text-xl font-bold mb-1">{item.name}</Text>
                <Text>
                    Durasi: {item.duration} {item.type}
                </Text>
            </View>
        </SafeAreaView>
    )
}


