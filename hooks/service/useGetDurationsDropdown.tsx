import axiosInstance from '@/libs/axios'
import { useQuery } from '@tanstack/react-query'

interface IDurationResponse {
    id: string
    name: number
}

const useGetDurationsDropdown = (filter: string) => {
    const url: string = `/duration?filter=${filter}`
    return useQuery({
        queryKey: ['durations', { filter }],
        queryFn: async () =>
            axiosInstance.get(url).then((response: any) => {
                return response.map((data: IDurationResponse) => {
                    return {
                        label: data.name,
                        value: data.id,
                    }
                })
            }),
        staleTime: Infinity,
    })
}

export default useGetDurationsDropdown
