import { Stack } from 'expo-router'
import React from 'react'

export default function ServiceLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{ title: 'Pengaturan Layanan' }}
            />
            <Stack.Screen name="create" options={{ title: 'Tambah Layanan' }} />
            <Stack.Screen name="[id]" options={{ title: 'Edit Layanan' }} />
        </Stack>
    )
}
