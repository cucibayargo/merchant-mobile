import { FormField } from '@/components/formInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { SafeAreaView, View } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { Button } from 'react-native-paper'
import { z } from 'zod'
import useUpdateCustomer from '@/hooks/customer/useUpdateCustomer'
import useGetCustomer from '@/hooks/customer/useGetCustomer'

export default function CustomerDetail() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const formSchema = z.object({
        name: z.string().min(1, { message: 'Nama wajib diisi' }),
        phone_number: z.string().min(1, { message: 'No HP wajib diisi' }),
        gender: z.string().min(1, { message: 'Jenis Kelamin Wajib diisi' }),
        address: z.string(),
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
            phone_number: '',
            gender: 'Laki-laki',
            address: '',
        },
        mode: 'onChange',
    })
    const { data, isLoading } = useGetCustomer(id!)
    const { mutateAsync: updateCustomer, isPending: isUpdateCustomerPending } =
        useUpdateCustomer(id!)

    useEffect(() => {
        if (id) {
            reset(data?.data)
        }
    }, [data])

    const handleSave = async (data: ChangePasswordForm) => {
        updateCustomer(data)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Spinner visible={isLoading || isUpdateCustomerPending} />

            <View style={{ padding: 16 }}>
                <FormField.PaperInput<CustomForm, 'name'>
                    control={control}
                    name="name"
                    label="Nama"
                    autoCapitalize="none"
                />

                <FormField.PaperNumber<CustomForm, 'phone_number'>
                    control={control}
                    name="phone_number"
                    label="No Hp"
                    precision={0}
                    min={1}
                />

                <FormField.PaperSelect<CustomForm, 'gender'>
                    control={control}
                    name="gender"
                    label="Jenis Kelamin"
                    options={[
                        {
                            value: 'Laki-laki',
                            label: 'Laki-laki',
                        },
                        {
                            value: 'Perempuan',
                            label: 'Perempuan',
                        },
                    ]}
                />

                <FormField.PaperTextArea<CustomForm, 'address'>
                    control={control}
                    name="address"
                    label="Alamat"
                />

                <Button mode="contained" onPress={handleSubmit(handleSave)}>
                    Simpan
                </Button>
            </View>
        </SafeAreaView>
    )
}
