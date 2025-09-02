import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import axiosInstance from '@/libs/axios'

const useChangePassword = () => {
    const url: string = 'auth/change-password'
    const router = useRouter()

    return useMutation({
        mutationKey: ['changePassword'],
        mutationFn: async (paylod: IChangePasswordPayload) => {
            return await axiosInstance.post(url, paylod)
        },
        onSuccess: () => {
            router.push('/(tabs)/profile')
        },
    })
}

export default useChangePassword
