import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/libs/axios'

const useUploadLogo = () => {
    const url: string = '/user/upload-logo'
    // const { toast } = useToast()

    return useMutation({
        mutationKey: ['userUploadLogo'],
        mutationFn: async (logo: File) => {
            const formData = new FormData()
            formData.append('file', logo)

            return axiosInstance.post(url, formData, {
                headers: { 'content-type': 'multipart/form-data' },
            })
        },
        onSuccess: () => {
            // toast({
            //     description: 'Logo berhasil diuanggah',
            //     variant: 'success',
            // })
        },
    })
}

export default useUploadLogo
