import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import axiosInstance from '@/libs/axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ToastAndroid } from 'react-native'

interface IPayload {
    email: string
    password: string
    phone_number: string
    name: string
    subscription_plan: string
    phone_number_input?: number
}

const useSignup = () => {
    const url: string = `/auth/signup`
    const router = useRouter()

    return useMutation({
        mutationKey: ['signup'],
        mutationFn: async (paylod: IPayload) => {
            paylod.phone_number = paylod.phone_number_input
                ? `0${paylod.phone_number_input.toString()}`
                : ''
            delete paylod.phone_number_input
            return await axiosInstance.post(url, paylod)
        },

        onSuccess: async () => {
            router.push('/(tabs)/home')
            await AsyncStorage.removeItem('signupData')
            await AsyncStorage.removeItem('userDetails')

            ToastAndroid.show('Akun berhasil didaftarkan', ToastAndroid.SHORT)
        },
    })
}

export default useSignup
