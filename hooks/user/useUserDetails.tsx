import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/libs/axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useContext } from 'react'
import { UserContext } from '@/context/user'

const useUserDetails = () => {
    const url: string = '/user/details'
    const { setUserDetails } = useContext(UserContext)

    return useMutation({
        mutationKey: ['userDetails'],
        mutationFn: async () => axiosInstance.get(url),
        onSuccess: async (data) => {
            await AsyncStorage.setItem('userDetails', JSON.stringify(data.data))
            setUserDetails(data.data)
        },
    })
}

export default useUserDetails
