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
}

const useSignup = () => {
    const url: string = `/auth/signup`
    const router = useRouter()

    return useMutation({
        mutationKey: ['signup'],
        mutationFn: async (paylod: IPayload) => {
            return await axiosInstance.post(url, paylod)
        },

        onSuccess: async () => {
            router.push('/')
            await AsyncStorage.removeItem('signupData')
            await AsyncStorage.removeItem('userDetails')

            ToastAndroid.show('Akun berhasil didaftarkan', ToastAndroid.SHORT)
        },
    })
}

export default useSignup
