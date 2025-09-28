import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/libs/axios'
import { useRouter } from 'expo-router'

const useCreateCustomer = () => {
    const url: string = '/customer'
    const router = useRouter()

    return useMutation({
        mutationKey: ['createCustomer'],
        mutationFn: async (values: any) =>
            await axiosInstance.post(url, values),
        onSuccess: () => {
            router.push('/customer')

            // toast({
            //   description: "Pelanggan baru berhasil ditambahkan",
            //   variant: "success",
            // });
        },
        onError: (e) => console.log(e.message),
    })
}

export default useCreateCustomer
