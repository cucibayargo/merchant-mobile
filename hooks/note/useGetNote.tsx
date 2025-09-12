import axiosInstance from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

const useGetNote = () => {
    const url: string = '/note'
    return useQuery({
        queryKey: ['note'],
        queryFn: async () => axiosInstance.get(url),
        throwOnError: true,
    })
}

export default useGetNote
