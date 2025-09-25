import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/libs/axios'

const useDeleteCustomer = () => {
    // const { toast } = useToast();

    return useMutation({
        mutationKey: ['deleteCustomer'],
        mutationFn: async (id: string) => {
            const url: string = `/customer/${id}`
            return await axiosInstance.delete(url)
        },
        // onSuccess: () => {
        //   toast({
        //     description: "Pelanggan berhasil dihapus",
        //     variant: "success",
        //   });
        // },
    })
}

export default useDeleteCustomer
