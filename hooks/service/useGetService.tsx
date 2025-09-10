import axiosInstance from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

const useGetService = (id: string) => {
    const url: string = `/service/${id}`

    return useQuery({
        queryKey: ['service', id],
        queryFn: async () => await axiosInstance.get(url),
        staleTime: Infinity,
        enabled: !!id,
        throwOnError: true,
    })
}

export default useGetService
