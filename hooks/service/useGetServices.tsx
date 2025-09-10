import axiosInstance from '@/libs/axios'
import { generateUrlWithParams } from '@/libs/generateUrlWithParams'
import { useQuery } from '@tanstack/react-query'

const useGetServices = (props: IGetServicesProps) => {
    let url: string = `/service?`
    url = generateUrlWithParams(url, props)

    return useQuery({
        queryKey: ['services', props?.duration, props?.filter],
        queryFn: async () => axiosInstance.get(url),
        staleTime: Infinity,
        throwOnError: true,
    })
}

export default useGetServices
