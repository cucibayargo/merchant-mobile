import { Stack } from 'expo-router'
import React from 'react'

export default function SettingsLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{ title: 'Pengaturan Durasi' }}
            />
            <Stack.Screen name="create" options={{ title: 'Tambah Durasi' }} />
            <Stack.Screen name="[id]" options={{ title: 'Edit Durasi' }} />
        </Stack>
    )
}
