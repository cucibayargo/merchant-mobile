import { useQuery } from '@tanstack/react-query'
import { generateUrlWithParams } from '@/libs/generateUrlWithParams'
import axiosInstance from '@/libs/axios'
import { IGetCustomerProps } from '@/types/customer'

const useGetCustomers = (props: IGetCustomerProps) => {
    const url: string = generateUrlWithParams(`/customer?`, props)
    return useQuery({
        queryKey: ['customers', props],
        queryFn: async () => axiosInstance.get(url),
        throwOnError: true,
    })
}

export default useGetCustomers
