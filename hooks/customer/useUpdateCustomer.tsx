import { useMutation, useQueryClient } from '@tanstack/react-query'
import axiosInstance from '@/libs/axios'
import { useRouter } from 'expo-router'

const useUpdateCustomer = (id: string) => {
    const url: string = `/customer/${id}`
    const router = useRouter()
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['updateCustomer'],
        mutationFn: async (values: any) => await axiosInstance.put(url, values),
        onSuccess: () => {
            router.push('/customer')

            queryClient.invalidateQueries({
                queryKey: ['customer', id],
            })

            // toast({
            //   description: "Pelanggan berhasil diperbaharui",
            //   variant: "success",
            // });
        },
    })
}

export default useUpdateCustomer
