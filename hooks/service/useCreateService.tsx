import axiosInstance from '@/libs/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'

const useCreateService = () => {
    const url: string = '/service'
    const router = useRouter()
    const queryClient = useQueryClient()
    // const { toast } = useToast();

    return useMutation({
        mutationKey: ['createService'],
        mutationFn: async (values: any) =>
            await axiosInstance.post(url, values),
        onSuccess: () => {
            router.push('/service')

            queryClient.invalidateQueries({
                queryKey: ['services'],
            })

            // toast({
            //   description: "Layanan baru berhasil ditambahkan",
            //   variant: "success",
            // });
        },
    })
}

export default useCreateService
