import { Stack } from 'expo-router'
import React from 'react'

const OrderStackLayout = () => {
    return (
        <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="index"
                options={{ headerShown: true, title: 'Order' }}
            />
            <Stack.Screen name="[id]" options={{ headerShown: false }} />
        </Stack>
    )
}

export default OrderStackLayout
