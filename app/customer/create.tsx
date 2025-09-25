import { FormField } from '@/components/formInput'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { SafeAreaView, View } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { Button } from 'react-native-paper'
import { z } from 'zod'
import useCreateCustomer from '@/hooks/customer/useCreateCustomer'

export default function CreateCustomer() {
    const formSchema = z.object({
        name: z.string().min(1, { message: 'Nama wajib diisi' }),
        phone_number: z.number().min(1, { message: 'No HP wajib diisi' }),
        gender: z.string().min(1, { message: 'Jenis Kelamin Wajib diisi' }),
        address: z.string(),
    })
    const { control, handleSubmit } = useForm<CustomForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            phone_number: 0,
            gender: 'Laki-laki',
            address: '',
        },
        mode: 'onChange',
    })
    const { mutateAsync: createCustomer, isPending: isCreateCustomerPending } =
        useCreateCustomer()

    const handleSave = async (data: ChangePasswordForm) => {
        data.phone_number = data.phone_number.toString()
        createCustomer(data)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <Spinner visible={isCreateCustomerPending} />

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
