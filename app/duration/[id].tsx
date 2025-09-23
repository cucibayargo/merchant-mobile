import { FormField } from '@/components/formInput'
import useGetDetailDuration from '@/hooks/duration/useGetDetailDuration'
import useUpdateDuration from '@/hooks/duration/useUpdateDuration'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { SafeAreaView, View } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { Button } from 'react-native-paper'
import { z } from 'zod'

export default function DurationDetail() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const router = useRouter()
    const formSchema = z.object({
        name: z.string().min(1, { message: 'Nama wajib diisi' }),
        duration: z.number().min(1, { message: 'Durasi wajib diisi' }),
        type: z.string().min(1, { message: 'Tipe wajib diisi' }),
    })
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, isValid },
    } = useForm<CustomForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            duration: '',
            type: '',
        },
        mode: 'onChange',
    })
    const { data, isLoading } = useGetDetailDuration(id!)
    const { mutateAsync: updateDuration, isPending: isPendingUpdate } =
        useUpdateDuration(id!)

    useEffect(() => {
        if (id) {
            reset(data?.data)
        }
    }, [data])

    const handleSave = async (data: ChangePasswordForm) => {
        updateDuration(data)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Spinner visible={isLoading || isPendingUpdate} />

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

                <Button
                    mode="contained"
                    // style={styles.submitButton}
                    onPress={handleSubmit(handleSave)}
                >
                    Simpan
                </Button>
            </View>
        </SafeAreaView>
    )
}
