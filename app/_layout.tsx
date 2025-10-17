import { CreateOrderProvider } from '@/context/createOrder'
import { UserProvider, useUser } from '@/context/user'
import useAuth from '@/hooks/auth/useAuth'
import { QueryClient } from '@tanstack/query-core'
import { QueryClientProvider } from '@tanstack/react-query'
import { router, Slot, Stack, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { Text, TextInput } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { DefaultTheme, PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import './globals.css'

// Set default text color globally for React Native components
Text.defaultProps = {
    ...Text.defaultProps,
    style: {
        color: '#181718',
    },
}

TextInput.defaultProps = {
    ...TextInput.defaultProps,
    style: {
        color: '#181718',
    },
}

function RootLayoutNav() {
    const { isAuthenticated, isLoading } = useUser()
    const segments = useSegments()

    // Initialize authentication check
    useAuth()

    useEffect(() => {
        if (isLoading) return

        const inAuthGroup = segments[0] === 'auth'

        if (!isAuthenticated && !inAuthGroup) {
            // User is not authenticated and not in auth group, redirect to login
            router.replace('/auth/login')
        } else if (isAuthenticated && inAuthGroup) {
            // User is authenticated but in auth group, redirect to home
            router.replace('/(tabs)')
        }
    }, [isAuthenticated, isLoading, segments])

    useEffect(() => {
        if (!isLoading) {
            SplashScreen.hideAsync()
        }
    }, [isLoading])

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Slot />
        </Stack>
    )
}

SplashScreen.preventAutoHideAsync() // keep splash while deciding

export default function RootLayout() {
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
            text: '#181718', // Default text color
            placeholder: '#999999',
            onSurface: '#181718', // Text color on surfaces
            onBackground: '#181718', // Text color on background
            onSurfaceVariant: '#181718', // Text color for surface variants
            outline: '#181718', // Outline color
            outlineVariant: '#181718', // Outline variant color
        },
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <PaperProvider theme={lightTheme}>
                    <QueryClientProvider client={queryClient}>
                        <UserProvider>
                            <CreateOrderProvider>
                                <RootLayoutNav />
                            </CreateOrderProvider>
                        </UserProvider>
                    </QueryClientProvider>
                </PaperProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    )
}
