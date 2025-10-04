import axiosInstance from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

const useGetOrder = (id: string) => {
    let url: string = `/transaction/${id}`

    return useQuery({
        queryKey: ['orders', id],
        queryFn: async () => axiosInstance.get(url),
        staleTime: Infinity,
    })
}

export default useGetOrder
