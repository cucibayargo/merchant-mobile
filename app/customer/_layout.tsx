import { Stack } from 'expo-router'
import React from 'react'

export default function CustomerLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Pelanggan' }} />
            <Stack.Screen
                name="create"
                options={{ title: 'Tambah Pelanggan' }}
            />
            <Stack.Screen name="[id]" options={{ title: 'Edit Pelanggan' }} />
        </Stack>
    )
}
