import { Stack } from 'expo-router'
import './globals.css'
import { QueryClient } from '@tanstack/query-core'
import { QueryClientProvider } from '@tanstack/react-query'

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

    return (
        <QueryClientProvider client={queryClient}>
            <Stack>
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
            </Stack>
        </QueryClientProvider>
    )
}
