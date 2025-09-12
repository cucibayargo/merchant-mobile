import { Stack } from 'expo-router'
import React from 'react'

export default function NoteLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{ title: 'Pengaturan Catatan' }}
            />
        </Stack>
    )
}
