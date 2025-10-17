import { FormField } from '@/components/formInput'
import { images } from '@/constans/images'
import { useUser } from '@/context/user'
import useLogin from '@/hooks/auth/useLogin'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'expo-router'
import { useForm } from 'react-hook-form'
import {
    Button,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { z } from 'zod'

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
            email: 'Yoo3@rama.com',
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

    // Authentication redirect is now handled in _layout.tsx

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log('data', data)
        login(data)
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingHorizontal: 16,
                    backgroundColor: 'white',
                    height: '100%',
                }}
            >
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

                <View
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 20,
                        gap: 4,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            lineHeight: 20,
                            textAlign: 'center',
                        }}
                    >
                        Belum punya akun?
                    </Text>
                    <TouchableOpacity>
                        <Text
                            style={{
                                fontSize: 14,
                                lineHeight: 20,
                                textAlign: 'center',
                            }}
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
