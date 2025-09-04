import axiosInstance from '@/libs/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'

const useUpdateDuration = (id: string) => {
    const url: string = `/duration/${id}`
    const router = useRouter()
    const queryClient = useQueryClient()
    // const { toast } = useToast();

    return useMutation({
        mutationKey: ['updateDuration'],
        mutationFn: async (values: any) => await axiosInstance.put(url, values),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['duration', id],
            })

            router.push('/duration')

            // toast({
            //   description: "Durasi berhasil diperbarui",
            //   variant: "success",
            // });
        },
    })
}

export default useUpdateDuration
