import { Tabs, useRouter } from 'expo-router'
import { ClipboardPlus, House, ScrollText, User } from 'lucide-react-native'
import React from 'react'

const MainTabNavigator = () => {
    const router = useRouter()
    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let icon

                    if (route.name === 'home') {
                        icon = focused ? (
                            <House size={size} color={color} />
                        ) : (
                            <House size={size} color={color} strokeWidth={1} />
                        )
                    } else if (
                        route.name === 'order/index' ||
                        route.name === 'order'
                    ) {
                        icon = focused ? (
                            <ScrollText size={size} color={color} />
                        ) : (
                            <ScrollText
                                size={size}
                                color={color}
                                strokeWidth={1}
                            />
                        )
                    } else if (route.name === 'createOrder') {
                        icon = focused ? (
                            <ClipboardPlus size={size} color={color} />
                        ) : (
                            <ClipboardPlus
                                size={size}
                                color={color}
                                strokeWidth={1}
                            />
                        )
                    } else if (route.name === 'profile') {
                        icon = focused ? (
                            <User size={size} color={color} />
                        ) : (
                            <User size={size} color={color} strokeWidth={1} />
                        )
                    }

                    return icon
                },
                tabBarActiveTintColor: '#1976d2',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Beranda',
                    headerShown: false,
                }}
            />

            <Tabs.Screen
                name="order/index"
                options={{
                    title: 'Order',
                    headerShown: false,
                    href: '/(tabs)/order/index',
                }}
            />

            <Tabs.Screen
                name="createOrder"
                options={{
                    title: 'Buat Baru',
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil',
                }}
            />
        </Tabs>
    )
}

export default MainTabNavigator
