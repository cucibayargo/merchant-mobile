import axiosInstance from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

const useGetDetailDuration = (id: string) => {
    const url: string = `/duration/${id}`

    return useQuery({
        queryKey: ['duration', id],
        queryFn: async () => await axiosInstance.get(url),
        staleTime: Infinity,
        enabled: !!id,
        throwOnError: true,
    })
}

export default useGetDetailDuration
