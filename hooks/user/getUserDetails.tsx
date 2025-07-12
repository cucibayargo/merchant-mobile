import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/libs/axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const useUserDetails = () => {
    const url: string = '/user/details'

    return useMutation({
        mutationKey: ['userDetails'],
        mutationFn: async () => axiosInstance.get(url),
        onSuccess: async (data) => {
            await AsyncStorage.setItem('userDetails', JSON.stringify(data.data))
        },
    })
}

export default useUserDetails
