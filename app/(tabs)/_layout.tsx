import React from 'react'
import { ScrollText, House } from 'lucide-react-native'
import { Tabs } from 'expo-router'

const MainTabNavigator = () => {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let icon

                    console.log(route)
                    if (route.name === 'home') {
                        icon = focused ? (
                            <House size={size} color={color} />
                        ) : (
                            <House size={size} color={color} />
                        )
                    } else if (route.name === 'order') {
                        icon = focused ? (
                            <ScrollText size={size} color={color} />
                        ) : (
                            <ScrollText size={size} color={color} />
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
                name="order"
                options={{
                    title: 'Order',
                }}
            />
        </Tabs>
    )
}

export default MainTabNavigator
