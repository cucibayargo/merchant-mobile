import axiosInstance from '@/libs/axios'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'expo-router'

const useCreateDuration = () => {
    const url: string = '/duration'
    const router = useRouter()
    // const { toast } = useToast();

    return useMutation({
        mutationKey: ['createDuration'],
        mutationFn: async (values: any) =>
            await axiosInstance.post(url, values),
        onSuccess: () => {
            router.push('/duration')

            // toast({
            //   description: "Durasi baru berhasil ditambahkan",
            //   variant: "success",
            // });
        },
    })
}

export default useCreateDuration
