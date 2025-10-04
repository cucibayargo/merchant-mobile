import useGetUserDetails from '@/hooks/user/useGetUserDetails'
import axiosInstance from '@/libs/axios'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'

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
        onSuccess: () => {
            getUserDetails()
            router.push('/(tabs)/home')
        },
        onError: (error) => {
            console.log(error)
        },
    })
}

export default useLogin
