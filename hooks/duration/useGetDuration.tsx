import axiosInstance from '@/libs/axios'
import { generateUrlWithParams } from '@/libs/generateUrlWithParams'
import { useQuery } from '@tanstack/react-query'

const useGetDuration = (props: IGetDurationsParams) => {
    let url: string = `/duration?`
    url = generateUrlWithParams(url, props)

    return useQuery({
        queryKey: ['durations', { props }],
        queryFn: async () => axiosInstance.get(url),
        // staleTime: Infinity,
        throwOnError: true,
    })
}

export default useGetDuration
