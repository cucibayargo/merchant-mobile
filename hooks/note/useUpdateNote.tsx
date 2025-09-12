import axiosInstance from '@/libs/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface INotes {
    notes: string
}

const useUpdateNote = () => {
    const url: string = '/note'
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['updateDuration'],
        mutationFn: async (values: INotes) =>
            await axiosInstance.put(url, values),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['note'],
            })
        },
    })
}

export default useUpdateNote
