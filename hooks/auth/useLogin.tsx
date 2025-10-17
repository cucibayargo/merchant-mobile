import useGetUserDetails from '@/hooks/user/useGetUserDetails'
import axiosInstance from '@/libs/axios'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
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
            SecureStore.setItemAsync('authToken', data.data.token)
            getUserDetails()
            // Navigation will be handled automatically by _layout.tsx
        },
        onError: (error) => {
            // console.log(error)
        },
    })
}

export default useLogin
