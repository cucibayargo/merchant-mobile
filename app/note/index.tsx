import { Button, Text } from 'react-native-paper'
import { SafeAreaView, View } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormField } from '@/components/formInput'
import React, { useEffect } from 'react'
import useUpdateNote from '@/hooks/note/useUpdateNote'
import useGetNote from '@/hooks/note/useGetNote'
import Spinner from 'react-native-loading-spinner-overlay'

const NoteIndex = () => {
    const formSchema = z.object({
        notes: z.string().min(1, { message: 'Ketentuan wajib diisi' }),
    })
    const { control, reset, handleSubmit } = useForm<
        z.infer<typeof formSchema>
    >({
        resolver: zodResolver(formSchema),
        defaultValues: {
            notes: '1. \n2. \n3. ',
        },
    })
    const { mutateAsync: updateNote, isPending } = useUpdateNote()
    const { data, isLoading } = useGetNote()

    useEffect(() => {
        reset(data?.data)
    }, [data])

    const submitForm = (values: z.infer<typeof formSchema>) => {
        updateNote(values)
    }

    return (
        <SafeAreaView style={{ backgroundColor: '#f0eeeb', flex: 1 }}>
            <Spinner visible={isLoading || isPending} />

            <View
                className="px-4 pt-4"
                style={{ paddingHorizontal: 16, paddingTop: 16 }}
            >
                <FormField.PaperTextArea<CustomForm, 'notes'>
                    control={control}
                    name="notes"
                    label="Durasi"
                    rows={4}
                    autoGrow={false}
                    minHeight={400}
                />

                <Button mode="contained" onPress={handleSubmit(submitForm)}>
                    Simpan
                </Button>
            </View>
        </SafeAreaView>
    )
}

export default NoteIndex
