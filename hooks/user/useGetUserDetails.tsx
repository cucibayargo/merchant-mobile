import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/libs/axios'
import * as SecureStore from 'expo-secure-store'
import { useUser } from '@/context/user'

const useGetUserDetails = () => {
    const url: string = '/user/details'
    const { setUser } = useUser()

    return useMutation({
        mutationKey: ['userDetails'],
        mutationFn: async () => axiosInstance.get(url),
        onSuccess: (data) => {
            setUser(data.data)
        },
    })
}

export default useGetUserDetails
