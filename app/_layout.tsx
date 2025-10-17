import { CreateOrderProvider } from '@/context/createOrder'
import { UserProvider } from '@/context/user'
import { QueryClient } from '@tanstack/query-core'
import { QueryClientProvider } from '@tanstack/react-query'
import { router, Slot, Stack, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { DefaultTheme, PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import './globals.css'

function useSession() {
    // session: null (signed out) | object (signed in)
    // isLoaded: true when you've read from SecureStore/AsyncStorage or finished bootstrap
    return { session: null, isLoaded: true }
}

SplashScreen.preventAutoHideAsync() // keep splash while deciding

export default function RootLayout() {
    // const jwtTokenErrors: string[] = [
    //     'Akses ditolak. Token tidak sesuai',
    //     'Token tidak ditemukan',
    //     'Langganan Anda telah kedaluwarsa. Silakan perbarui langganan Anda atau hubungi administrator.',
    // ]

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                throwOnError: true,
            },
            mutations: {
                retry: false,
            },
        },
    })

    const lightTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: '#6200ee', // you can customize
            background: '#ffffff',
            surface: '#ffffff',
            text: '#000000',
            placeholder: '#999999',
        },
    }

    const { session, isLoaded } = useSession()
    const segments = useSegments()

    useEffect(() => {
        if (!isLoaded) return

        router.replace('/auth/login')
    }, [isLoaded, session, segments])

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <PaperProvider theme={lightTheme}>
                    <QueryClientProvider client={queryClient}>
                        <UserProvider>
                            <CreateOrderProvider>
                                <Stack screenOptions={{ headerShown: false }}>
                                    <Slot />
                                    {/* <Stack.Screen
                                        name="auth/login"
                                        options={{ headerShown: false }}
                                    />
                                    <Stack.Screen
                                        name="auth/signup"
                                        options={{ headerShown: false }}
                                    />
                                    <Stack.Screen
                                        name="auth/choosePlan"
                                        options={{ headerShown: false }}
                                    />
                                    <Stack.Screen name="(tabs)" />
                                    <Stack.Screen name="changePassword" /> */}
                                </Stack>
                            </CreateOrderProvider>
                        </UserProvider>
                    </QueryClientProvider>
                </PaperProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    )
}
