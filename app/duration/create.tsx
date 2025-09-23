import { FormField } from '@/components/formInput'
import useCreateDuration from '@/hooks/duration/useCreateDuration'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { SafeAreaView, View } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { Button } from 'react-native-paper'
import { z } from 'zod'

export default function CreateDuration() {
    const formSchema = z.object({
        name: z.string().min(1, { message: 'Nama wajib diisi' }),
        duration: z.number().min(1, { message: 'Durasi wajib diisi' }),
        type: z.string().min(1, { message: 'Tipe wajib diisi' }),
    })
    const { control, handleSubmit } = useForm<CustomForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            duration: 0,
            type: '',
        },
        mode: 'onChange',
    })
    const { mutateAsync: createDuration, isPending: isPendingCreate } =
        useCreateDuration()

    const handleSave = async (data: ChangePasswordForm) => {
        createDuration(data)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Spinner visible={isPendingCreate} />

            <View style={{ padding: 16 }}>
                <FormField.PaperInput<CustomForm, 'name'>
                    control={control}
                    name="name"
                    label="Nama"
                    autoCapitalize="none"
                />

                <FormField.PaperNumber<CustomForm, 'duration'>
                    control={control}
                    name="duration"
                    label="Durasi"
                    precision={0}
                    min={1}
                />

                <FormField.PaperSelect<CustomForm, 'type'>
                    control={control}
                    name="type"
                    label="Tipe"
                    options={[
                        {
                            value: 'Jam',
                            label: 'Jam',
                        },
                        {
                            value: 'Hari',
                            label: 'Hari',
                        },
                    ]}
                />

                <Button mode="contained" onPress={handleSubmit(handleSave)}>
                    Simpan
                </Button>
            </View>
        </SafeAreaView>
    )
}
