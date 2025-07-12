import React from 'react'
import { View, Text, TextInput, Button, ScrollView } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useSignup from '@/hooks/auth/useSignup'
import Spinner from 'react-native-loading-spinner-overlay'

const Signup = () => {
    const formSchema = z
        .object({
            name: z.string().min(1, { message: 'Nama wajib diisi' }),
            email: z.string().min(1, { message: 'Email wajib diisi' }).email(),
            password: z
                .string()
                .min(8, { message: 'Minimal 8 karakter' })
                .max(20, { message: 'Maksimal 20 karakter' })
                .refine((password) => /[A-Z]/.test(password), {
                    message: 'Harus memiliki huruf kapital',
                })
                .refine((password) => /[a-z]/.test(password), {
                    message: 'Harus memiliki huruf kecil',
                })
                .refine((password) => /[0-9]/.test(password), {
                    message: 'Harus Memiliki angka',
                }),
            repeat_password: z
                .string()
                .min(1, { message: 'Ulang Password wajib diisi' }),
            phone_number: z
                .string()
                .min(1, { message: 'Nomor HP wajib diisi' }),
        })
        .refine((data) => data.password === data.repeat_password, {
            message: 'Passwords tidak sama',
            path: ['repeat_password'],
        })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            repeat_password: '',
            phone_number: '',
        },
        mode: 'onBlur',
    })

    const localSearchParams = useLocalSearchParams()
    const { mutateAsync: signup, isPending } = useSignup()
    const router = useRouter()

    const submitForm = async (values: z.infer<typeof formSchema>) => {
        const payload = {
            name: values.name,
            email: values.email,
            phone_number: values.phone_number,
            password: values.password,
            subscription_plan: localSearchParams['subscription_plan']!,
        }

        console.log('localSearchParams', localSearchParams['subscription_plan'])

        if (localSearchParams['subscription_plan'] === 'gratis') {
            try {
                await AsyncStorage.setItem(
                    'signupData',
                    JSON.stringify(payload)
                )
                router.push('/auth/choosePlan')
            } catch (e) {
                console.log('error', e)
            }
        } else {
            signup({
                ...payload,
                subscription_plan: localSearchParams['subscription_plan'][0],
            })
        }
    }

    return (
        <ScrollView
            contentContainerStyle={{
                justifyContent: 'center',
                backgroundColor: 'white',
                flex: 1,
            }}
        >
            <Spinner visible={isPending} />

            <Text className={'text-2xl font-bold mb-5'}>Daftar Akun</Text>

            <View>
                <View className="mb-3">
                    <Controller
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <View>
                                <Text>Nama</Text>
                                <TextInput
                                    className="border rounded mt-2"
                                    onChangeText={(value) =>
                                        field.onChange(value)
                                    }
                                />

                                {form.formState.errors.name && (
                                    <Text className="text-red-500 text-xs">
                                        {form.formState.errors.name.message}
                                    </Text>
                                )}
                            </View>
                        )}
                    ></Controller>
                </View>

                <View className="mb-3">
                    <Controller
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <View>
                                <Text>Email</Text>
                                <TextInput
                                    className="border rounded mt-2"
                                    onChangeText={(value) =>
                                        field.onChange(value)
                                    }
                                />

                                {form.formState.errors.email && (
                                    <Text className="text-red-500 text-xs">
                                        {form.formState.errors.email.message}
                                    </Text>
                                )}
                            </View>
                        )}
                    ></Controller>
                </View>

                <View className="mb-3">
                    <Controller
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <View>
                                <Text>Password</Text>
                                <TextInput
                                    className="border rounded mt-2"
                                    secureTextEntry={true}
                                    onChangeText={(value) =>
                                        field.onChange(value)
                                    }
                                />

                                {form.formState.errors.password && (
                                    <Text className="text-red-500 text-xs">
                                        {form.formState.errors.password.message}
                                    </Text>
                                )}
                            </View>
                        )}
                    ></Controller>
                    <Text className="text-xs text-gray-500">
                        Format Password: Huruf kapital, Huruf kecil, Angka,
                        Minimal 8 karakter, Maksimal 20 karakter
                    </Text>
                </View>

                <View className="mb-3">
                    <Controller
                        control={form.control}
                        name="repeat_password"
                        render={({ field }) => (
                            <View>
                                <Text>Ulang Password</Text>
                                <TextInput
                                    className="border rounded mt-2"
                                    secureTextEntry={true}
                                    onChangeText={(value) =>
                                        field.onChange(value)
                                    }
                                />

                                {form.formState.errors['repeat_password'] && (
                                    <Text className="text-red-500 text-xs">
                                        {
                                            form.formState.errors[
                                                'repeat_password'
                                            ].message
                                        }
                                    </Text>
                                )}
                            </View>
                        )}
                    ></Controller>
                </View>

                <View className="mb-3">
                    <Controller
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                            <View>
                                <Text>No HP</Text>
                                <TextInput
                                    className="border rounded mt-2"
                                    onChangeText={(value) =>
                                        field.onChange(value)
                                    }
                                />

                                {form.formState.errors['phone_number'] && (
                                    <Text className="text-red-500 text-xs">
                                        {
                                            form.formState.errors[
                                                'phone_number'
                                            ].message
                                        }
                                    </Text>
                                )}
                            </View>
                        )}
                    ></Controller>
                </View>

                <Button
                    title={'Daftar'}
                    color={'#0a7ea4'}
                    onPress={form.handleSubmit(submitForm)}
                />
            </View>
        </ScrollView>
    )
}

export default Signup
