import React, { useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    Image,
    Button,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { images } from '@/constans/images'
import { useRouter } from 'expo-router'
import useLogin from '@/hooks/auth/useLogin'
import Spinner from 'react-native-loading-spinner-overlay'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import useGetUserDetails from '@/hooks/user/useGetUserDetails'
import { useUser } from '@/context/user'
import { FormField } from '@/components/formInput'

const Login = () => {
    const router = useRouter()
    const {
        mutateAsync: login,
        isPending,
        // isSuccess: isLoginSuccess,
    } = useLogin()

    const formSchema = z.object({
        email: z.string().min(1, { message: 'Email wajib diisi' }).email(),
        password: z.string().min(1, { message: 'Password wajib diisi' }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: 'Yoo2@rama.com',
            password: 'Pass1234',
        },
        mode: 'onBlur',
    })
    const { user } = useUser()

    const styles = StyleSheet.create({
        logo: {
            width: 100,
            height: 110,
            marginHorizontal: 'auto',
            marginBottom: 30,
        },
    })

    useEffect(() => {
        console.log('user', user)
        if (user) {
            router.replace('/home')
        }
    }, [])

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log('data', data)
        login(data)
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex justify-center px-4 bg-white h-screen">
                <Spinner visible={isPending} />

                <Image
                    source={images.loginLogo}
                    alt="logo"
                    style={styles.logo}
                />

                <FormField.PaperInput<LoginForm, 'email'>
                    control={form.control}
                    name="email"
                    label="Email"
                    autoCapitalize="none"
                />

                <FormField.PaperPassword<LoginForm, 'password'>
                    control={form.control}
                    name="password"
                    label="Password"
                    autoCapitalize="none"
                />

                <Button
                    data-id="button-login"
                    title={'Login'}
                    color={'#0a7ea4'}
                    onPress={form.handleSubmit(onSubmit)}
                />

                <View className={'flex flex-row justify-center mt-5 gap-1'}>
                    <Text className={'text-sm'}>Belum punya akun? </Text>
                    <TouchableOpacity>
                        <Text
                            className={'text-sm'}
                            onPress={() =>
                                router.push(
                                    '/auth/signup?subscription_plan=gratis'
                                )
                            }
                        >
                            Daftar disini
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default Login
