import axiosInstance from '@/libs/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'

const useUpdateService = (id: string) => {
    const url: string = `/service/${id}`
    const router = useRouter()
    const queryClient = useQueryClient()
    // const { toast } = useToast();

    return useMutation({
        mutationKey: ['updateService'],
        mutationFn: async (values: any) => await axiosInstance.put(url, values),
        onSuccess: () => {
            router.push('/service')

            queryClient.invalidateQueries({
                queryKey: ['services'],
            })

            queryClient.invalidateQueries({
                queryKey: ['service', id],
            })

            // toast({
            //   description: "Layanan berhasil diperbarui",
            //   variant: "success",
            // });
        },
    })
}

export default useUpdateService
