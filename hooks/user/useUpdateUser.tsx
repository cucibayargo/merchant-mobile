import { useMutation } from '@tanstack/react-query'
import axiosInstance from '@/libs/axios'
import { useUser } from '@/context/user'
import useGetUserDetails from '@/hooks/user/useGetUserDetails'

const useUpdateUser = () => {
    const { mutateAsync: getUserDetails } = useGetUserDetails()

    return useMutation({
        mutationKey: ['userDetails'],
        mutationFn: async ({ id, payload }: IParamUserUpdate) => {
            const url: string = `/user/${id}`
            return await axiosInstance.put(url, payload)
        },
        onSuccess: () => {
            getUserDetails()
        },
    })
}

export default useUpdateUser
