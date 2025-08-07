import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/libs/axios'
import { useRouter } from 'expo-router'
import { toast } from 'sonner'

const useCreateDuration = () => {
    const url: string = '/duration'
    const router = useRouter()

    return useMutation({
        mutationKey: ['createDuration'],
        mutationFn: async (values: any) =>
            await axiosInstance.post(url, values),
        onSuccess: () => {
            // router.push('/settings/duration')

            toast.success('Durasi baru berhasil ditambahkan')
        },
    })
}

export default useCreateDuration
