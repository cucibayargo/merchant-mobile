import axiosInstance from '@/libs/axios'
import { useMutation } from '@tanstack/react-query'

const useUploadLogo = () => {
    const url: string = '/user/upload-logo'
    // const { toast } = useToast()

    return useMutation({
        mutationKey: ['userUploadLogo'],
        mutationFn: async (file: File) => {
            // const res = await fetch(uri)
            // const blob = await res.blob()
            // const base64 = await FileSystem.readAsStringAsync(uri, {
            //     encoding: FileSystem.EncodingType.Base64,
            // })
            // return `data:${mime};base64,${base64}`
            const formData = new FormData()
            formData.append('file', file)

            return axiosInstance.post(url, formData, {
                headers: { 'content-type': 'multipart/form-data' },
            })
        },
        onSuccess: () => {
            alert('success upload image')
            // toast({
            //     description: 'Logo berhasil diuanggah',
            //     variant: 'success',
            // })
        },
        onError: (e) => {
            console.error('error upload image', e.message)
        },
    })
}

export default useUploadLogo
