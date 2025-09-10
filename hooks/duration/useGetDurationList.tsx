import { useQuery } from '@tanstack/react-query'
import { generateUrlWithParams } from '@/libs/generateUrlWithParams'
import axiosInstance from '@/libs/axios'

const useGetDurationList = (props: IGetDurationsListParams) => {
    let url: string = `/duration/all?`
    url = generateUrlWithParams(url, props)

    return useQuery({
        queryKey: ['durationsList', { props }],
        queryFn: async () => axiosInstance.get(url),
        staleTime: Infinity,
    })
}

export default useGetDurationList
