import axiosInstance from '@/libs/axios'
import { generateUrlWithParams } from '@/libs/generateUrlWithParams'
import { IGetCustomerProps } from '@/types/customer'
import { useQuery } from '@tanstack/react-query'

const useGetCustomers = (props: IGetCustomerProps) => {
    const url: string = generateUrlWithParams(`/customer?`, props)
    return useQuery({
        queryKey: ['customers', props],
        queryFn: async () => axiosInstance.get(url),
        throwOnError: true,
        staleTime: Infinity,
    })
}

export default useGetCustomers
