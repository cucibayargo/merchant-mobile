import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/libs/axios'
import { useRouter } from 'expo-router'

interface IPayload {
    email: string
    password: string
}

const useLogin = () => {
    const url: string = 'auth/login'
    const router = useRouter()
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['login'],
        mutationFn: async (paylod: IPayload) => {
            return await axiosInstance.post(url, paylod)
        },
        onSuccess: () => {
            // localStorage.setItem('activeMenu', 'order/ongoing')
            setTimeout(() => {
                router.push('/settings/duration')
                queryClient.invalidateQueries({
                    queryKey: ['orders'],
                })
            }, 1000)
        },
        onError: (error) => {
            console.log(error)
        },
    })
}

export default useLogin
