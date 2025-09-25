import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/libs/axios'

const useGetCustomer = (id: string) => {
    const url: string = `/customer/${id}`

    return useQuery({
        queryKey: ['customer', id],
        queryFn: async () => await axiosInstance.get(url),
        staleTime: Infinity,
        enabled: !!id,
        throwOnError: true,
    })
}

export default useGetCustomer
