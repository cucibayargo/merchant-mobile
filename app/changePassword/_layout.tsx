import { Stack } from 'expo-router'

const ChangePasswordLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Ubah Password',
                    headerShown: true,
                }}
            />
        </Stack>
    )
}

export default ChangePasswordLayout
