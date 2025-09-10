import axiosInstance from '@/libs/axios'
import { useMutation } from '@tanstack/react-query'

const useDeleteService = () => {
    // const { toast } = useToast();

    return useMutation({
        mutationKey: ['deleteService'],
        mutationFn: async (id: string) => {
            const url: string = `/service/${id}`
            return await axiosInstance.delete(url)
        },
        onSuccess: () => {
            // toast({
            //   description: "Layanan berhasil dihapus",
            //   variant: "success",
            // });
        },
    })
}

export default useDeleteService
