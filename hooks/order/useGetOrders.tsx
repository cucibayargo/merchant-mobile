import { useQuery } from '@tanstack/react-query'
import { generateUrlWithParams } from '@/libs/generateUrlWithParams'
import axiosInstance from '@/libs/axios'
import useDebounce from '../common/useDebounce'
import { useState } from 'react'
import { keepPreviousData } from '@tanstack/query-core'

const useGetOrders = (props: IGetOrdersProps) => {
    let url: string = `/transaction?`
    url = generateUrlWithParams(url, props)
    const [q, setQ] = useState('')
    const debouncedQ = useDebounce(q, 1000)
    console.log(url)

    return useQuery({
        queryKey: ['orders', props],
        queryFn: async () => axiosInstance.get(url),
        staleTime: Infinity,
        throwOnError: true,
        enabled: debouncedQ.trim().length > 0,
        placeholderData: keepPreviousData,
    })
}

export default useGetOrders
