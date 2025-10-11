import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/libs/axios'
import { useRouter } from 'expo-router'
import useGetUserDetails from '@/hooks/user/useGetUserDetails'
import * as SecureStore from 'expo-secure-store'
interface IPayload {
    email: string
    password: string
}

const useLogin = () => {
    const url: string = 'auth/login'
    const router = useRouter()
    const { mutateAsync: getUserDetails } = useGetUserDetails()

    return useMutation({
        mutationKey: ['login'],
        mutationFn: async (paylod: IPayload) => {
            return await axiosInstance.post(url, paylod)
        },
        onSuccess: (data) => {
            console.log('data', data)
            SecureStore.setItem('isLoggedIn', 'true')
            getUserDetails()
            router.push('/(tabs)/home')
        },
        onError: (error) => {
            // console.log(error)
        },
    })
}

export default useLogin
