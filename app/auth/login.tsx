import React from 'react'
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
import useUserDetails from '@/hooks/user/getUserDetails'

const Login = () => {
    const router = useRouter()
    const {
        mutateAsync: login,
        isPending,
        // isSuccess: isLoginSuccess,
    } = useLogin()
    const {
        // mutateAsync: getUserDetails,
        isPending: isPendingUserDetails,
        // data: userDetails,
        // isSuccess,
    } = useUserDetails()
    const formSchema = z.object({
        email: z.string().min(1, { message: 'Email wajib diisi' }).email(),
        password: z.string().min(1, { message: 'Password wajib diisi' }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    })

    const styles = StyleSheet.create({
        logo: {
            width: 100,
            height: 110,
            marginHorizontal: 'auto',
            marginBottom: 30,
        },
    })

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log('data', data)
        login(data)
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex justify-center px-4 bg-white h-screen">
                <Spinner visible={isPending || isPendingUserDetails} />

                <Image
                    source={images.loginLogo}
                    alt="logo"
                    style={styles.logo}
                />

                <View className="mb-5">
                    <Controller
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <View>
                                <Text>Email</Text>
                                <TextInput
                                    className="border rounded mt-2"
                                    placeholder="Enter your name"
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

                <View className="mb-5">
                    <Controller
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <View>
                                <Text>Password</Text>
                                <TextInput
                                    className="border rounded mt-2"
                                    placeholder="Enter your password"
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
                </View>

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
