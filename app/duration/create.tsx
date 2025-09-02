import axiosInstance from '@/libs/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
    ActivityIndicator,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'
import { z } from 'zod'

const schema = z.object({
    name: z.string().min(1, { message: 'Nama wajib diisi' }),
    duration: z
        .string()
        .min(1, { message: 'Durasi wajib diisi' })
        .regex(/^\d+$/, { message: 'Durasi harus angka' }),
    type: z.string().min(1, { message: 'Tipe wajib diisi' }),
})

type FormValues = z.infer<typeof schema>

export default function CreateDuration() {
    const router = useRouter()
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { name: '', duration: '', type: '' },
        mode: 'onBlur',
    })

    const mutation = useMutation({
        mutationKey: ['createDuration'],
        mutationFn: async (values: FormValues) =>
            axiosInstance.post('/duration', {
                ...values,
                duration: Number(values.duration),
            }),
        onSuccess: () => router.replace('/settings/duration'),
    })

    const onSubmit = (values: FormValues) => mutation.mutate(values)

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="p-4">
                <View className="mb-4">
                    <Text>Nama</Text>
                    <Controller
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <TextInput
                                className="border rounded px-3 py-2"
                                value={field.value}
                                onChangeText={field.onChange}
                            />
                        )}
                    />
                    {form.formState.errors.name && (
                        <Text className="text-red-500 text-xs">
                            {form.formState.errors.name.message}
                        </Text>
                    )}
                </View>

                <View className="mb-4">
                    <Text>Durasi</Text>
                    <Controller
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <TextInput
                                className="border rounded px-3 py-2"
                                value={field.value}
                                keyboardType="number-pad"
                                onChangeText={field.onChange}
                            />
                        )}
                    />
                    {form.formState.errors.duration && (
                        <Text className="text-red-500 text-xs">
                            {form.formState.errors.duration.message}
                        </Text>
                    )}
                </View>

                <View className="mb-4">
                    <Text>Tipe</Text>
                    <Controller
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <TextInput
                                className="border rounded px-3 py-2"
                                value={field.value}
                                onChangeText={field.onChange}
                            />
                        )}
                    />
                    {form.formState.errors.type && (
                        <Text className="text-red-500 text-xs">
                            {form.formState.errors.type.message}
                        </Text>
                    )}
                </View>

                <TouchableOpacity
                    className="bg-blue-600 rounded px-4 py-3 items-center"
                    onPress={form.handleSubmit(onSubmit)}
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white">Simpan</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}


