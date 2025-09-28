import React from 'react'
import { View, Text, TextInput, Button, ScrollView } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useSignup from '@/hooks/auth/useSignup'
import Spinner from 'react-native-loading-spinner-overlay'
import { FormField } from '@/components/formInput'

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
            phone_number_input: z
                .number()
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
            phone_number_input: 0,
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
            phone_number_input: values.phone_number_input,
            password: values.password,
            subscription_plan: localSearchParams['subscription_plan']!,
            phone_number: '',
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
                paddingHorizontal: 15,
            }}
        >
            <Spinner visible={isPending} />

            <Text style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>
                Daftar Akun
            </Text>

            <View>
                <FormField.PaperInput<CustomForm, 'name'>
                    control={form.control}
                    name="name"
                    label="Nama"
                    autoCapitalize="none"
                />

                <FormField.PaperInput<CustomForm, 'email'>
                    control={form.control}
                    name="email"
                    label="Email"
                    autoCapitalize="none"
                />

                <FormField.PaperPassword<CustomForm, 'password'>
                    control={form.control}
                    name="password"
                    label="Password"
                    autoCapitalize="none"
                    description={
                        'Format Password: Huruf kapital, Huruf kecil, Angka, Minimal\n' +
                        '8 karakter, Maksimal 20 karakter'
                    }
                />

                <FormField.PaperPassword<CustomForm, 'repeat_password'>
                    control={form.control}
                    name="repeat_password"
                    label="Ulang Password"
                    autoCapitalize="none"
                />

                <FormField.PaperNumber<CustomForm, 'phone_number_input'>
                    control={form.control}
                    name="phone_number_input"
                    label="No HP"
                    autoCapitalize="none"
                />

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
