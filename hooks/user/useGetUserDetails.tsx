import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/libs/axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useUser } from '@/context/user'

const useGetUserDetails = () => {
    const url: string = '/user/details'
    const { setUser } = useUser()

    return useMutation({
        mutationKey: ['userDetails'],
        mutationFn: async () => axiosInstance.get(url),
        onSuccess: async (data) => {
            await AsyncStorage.setItem('userDetails', JSON.stringify(data.data))
            setUser(data.data)
        },
    })
}

export default useGetUserDetails
