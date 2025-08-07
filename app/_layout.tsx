import { Stack } from 'expo-router'
import '@/app/globals.css'
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider'
import './globals.css'
import { QueryClient } from '@tanstack/query-core'
import { QueryClientProvider } from '@tanstack/react-query'
import { UserProvider } from '@/context/user'
import { Toaster } from 'sonner'
// import { UserProvider } from '@/context/user'

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
        <GluestackUIProvider mode="light">
            <QueryClientProvider client={queryClient}>
                <UserProvider>
                    <Toaster position={'top-center'} richColors={true} />
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
                </UserProvider>
            </QueryClientProvider>
        </GluestackUIProvider>
    )
}
