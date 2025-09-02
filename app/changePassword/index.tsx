import { Button, Text } from 'react-native-paper'
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
} from 'react-native'
import { FormField } from '@/components/formInput'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import useChangePassword from '@/hooks/profile/useChangePassword'
import { useUser } from '@/context/user'
import Spinner from 'react-native-loading-spinner-overlay'

const ChangePassword = () => {
    const formSchema = z
        .object({
            currentPassword: z
                .string()
                .min(1, { message: 'Password wajib diisi' }),
            newPassword: z
                .string()
                .min(8, { message: 'Minimal 8 karakter' })
                .max(20, { message: 'Maksimal 20 karakter' })
                .refine((password) => /[A-Z]/.test(password), {
                    message: 'Harus memiliki huruf kapital',
                })
                .refine((password) => /[a-z]/.test(password), {
                    message: 'Harus memiliki huruf kecil',
                })
                .refine((password) => /[0-9]/.test(password), {
                    message: 'Harus Memiliki angka',
                }),
            repeatNewPassword: z
                .string()
                .min(1, { message: 'Ulang Password Baru wajib diisi' }),
        })
        .refine((data) => data.newPassword === data.repeatNewPassword, {
            message: 'Passwords  tidak sama',
            path: ['repeatNewPassword'],
        })
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, isValid },
    } = useForm<ChangePasswordForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            repeatNewPassword: '',
        },
        mode: 'onChange',
    })
    const { mutateAsync: changePassword, isPending: isChangePasswordPending } =
        useChangePassword()
    const { user } = useUser()

    const handleSave = async (data: ChangePasswordForm) => {
        const payload = { ...data, email: user?.email }
        changePassword(payload)
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Spinner visible={isChangePasswordPending} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <FormField.PaperPassword<ChangePasswordForm, 'currentPassword'>
                    control={control}
                    name="currentPassword"
                    label="Password"
                    autoCapitalize="none"
                />

                <FormField.PaperPassword<ChangePasswordForm, 'newPassword'>
                    control={control}
                    name="newPassword"
                    label="Password Baru"
                    autoCapitalize="none"
                    description={
                        'Format Password: Huruf kapital, Huruf kecil, Angka, Minimal\n' +
                        '8 karakter, Maksimal 20 karakter'
                    }
                />

                <FormField.PaperPassword<
                    ChangePasswordForm,
                    'repeatNewPassword'
                >
                    control={control}
                    name="repeatNewPassword"
                    label="Ulang Password Baru"
                    autoCapitalize="none"
                />

                <Button
                    mode="contained"
                    style={styles.submitButton}
                    onPress={handleSubmit(handleSave)}
                >
                    Simpan
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 16,
    },
    submitButton: {
        marginBottom: 8,
    },
})

export default ChangePassword
