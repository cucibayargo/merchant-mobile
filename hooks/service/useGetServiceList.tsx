import axiosInstance from '@/libs/axios'
import { generateUrlWithParams } from '@/libs/generateUrlWithParams'
import { useQuery } from '@tanstack/react-query'

const useGetServiceList = (props: IGetServicesProps) => {
    let url: string = `/service/all?`
    url = generateUrlWithParams(url, props)

    return useQuery({
        queryKey: ['servicesList', props?.duration, props?.filter],
        queryFn: async () => axiosInstance.get(url),
        staleTime: Infinity,
    })
}

export default useGetServiceList
