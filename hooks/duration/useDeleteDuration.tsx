import axiosInstance from '@/libs/axios'
import { useMutation } from '@tanstack/react-query'

const useDeleteDuration = () => {
    // const { toast } = useToast();

    return useMutation({
        mutationKey: ['deleteDuration'],
        mutationFn: async (id: string) => {
            const url: string = `/duration/${id}`
            return await axiosInstance.delete(url)
        },
        onSuccess: () => {
            // toast({
            //   description: "Durasi berhasil dihapus",
            //   variant: "success",
            // });
        },
    })
}

export default useDeleteDuration
