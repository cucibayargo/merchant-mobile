import { Stack } from 'expo-router'
import './globals.css'
import { QueryClient } from '@tanstack/query-core'
import { QueryClientProvider } from '@tanstack/react-query'
import { UserProvider } from '@/context/user'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { DefaultTheme, PaperProvider, Portal } from 'react-native-paper'

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

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <PaperProvider theme={lightTheme}>
                    <QueryClientProvider client={queryClient}>
                        <UserProvider>
                            <Stack screenOptions={{ headerShown: false }}>
                                <Stack.Screen
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
                                <Stack.Screen name="changePassword" />
                            </Stack>
                        </UserProvider>
                    </QueryClientProvider>
                </PaperProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    )
}
