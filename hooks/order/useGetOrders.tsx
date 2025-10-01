import axiosInstance from '@/libs/axios'
import { generateUrlWithParams } from '@/libs/generateUrlWithParams'
import { IGetOrdersProps } from '@/types/order'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

const useGetOrders = (props: IGetOrdersProps) => {
    let url: string = `/transaction?`
    url = generateUrlWithParams(url, props)
    return useQuery({
        queryKey: ['orders', props],
        queryFn: async () => axiosInstance.get(url),
        throwOnError: true,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        placeholderData: keepPreviousData,
    })
}

export default useGetOrders
