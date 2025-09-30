import { Stack } from 'expo-router'
import React from 'react'

const OrderStackLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="[id]" options={{ headerShown: false }} />
        </Stack>
    )
}

export default OrderStackLayout
