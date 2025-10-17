import { FormField } from '@/components/formInput'
import { useUser } from '@/context/user'
import useUploadLogo from '@/hooks/profile/useUploadLogo'
import useUpdateUser from '@/hooks/user/useUpdateUser'
import { zodResolver } from '@hookform/resolvers/zod'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { Button, Text } from 'react-native-paper'
import { z } from 'zod'

const Profile = () => {
    const { user } = useUser()
    const [logoUri, setLogoUri] = useState<string>('')
    const [uploadedLogoPath, setUploadedLogoPath] = useState<string>('')
    const {
        mutateAsync: uploadLogo,
        isPending: isUploadLogoPending,
        isSuccess,
    } = useUploadLogo()
    const { mutateAsync: updateUser, isPending: isUpdateUserPending } =
        useUpdateUser()
    const formSchema = z.object({
        logo: z.any(),
        name: z.string().min(1, { message: 'Nama wajib diisi' }),
        email: z
            .string()
            .min(1, { message: 'Email wajib diisi' })
            .email({ message: 'Alamat email tidak valid' }),
        phone_number: z.string().min(1, { message: 'No HP wajib diisi' }),
        address: z.any(),
    })
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, isValid },
    } = useForm<ProfileForm>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: '', name: '', address: '' },
        mode: 'onChange',
    })
    const router = useRouter()

    useEffect(() => {
        if (user) {
            reset({ ...user, logo: '' })
        }
    }, [user])

    const requestAndroidGalleryPermission = async () => {
        if (Platform.OS !== 'android') return true

        if (
            Platform.OS !== 'android' ||
            (Platform.OS === 'android' && (Platform.Version as number) < 33)
        ) {
            const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
            if (perm.status !== 'granted') {
                throw new Error('Media library permission not granted')
            }
        }

        // 2) Launch system picker
        const result = await ImagePicker.launchImageLibraryAsync({
            base64: true,
            quality: 1,
        })
        if (result.canceled) return { ok: false, reason: 'canceled' }

        return `data:${result.assets[0].mimeType ?? 'image/jpeg'};base64,${result.assets[0].base64}`
    }

    const handlePickLogo = async () => {
        if (Platform.OS === 'android') {
            const file: any = await requestAndroidGalleryPermission()
            if (!file) {
                Alert.alert(
                    'Izin Ditolak',
                    'Tidak dapat mengakses galeri tanpa izin.'
                )
                return
            }

            uploadLogo(file)
        }
    }

    const handleSave = async (data: ProfileForm) => {
        const payload = { ...data, logo: '' }
        updateUser({ id: user?.id ?? '', payload })
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Spinner visible={isUploadLogoPending || isUpdateUserPending} />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Button
                    mode="outlined"
                    onPress={handlePickLogo}
                    style={styles.logoBox}
                >
                    {logoUri ? (
                        <Image
                            source={{ uri: logoUri }}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    ) : (
                        <Text>Upload Logo</Text>
                    )}
                </Button>

                <FormField.PaperInput<ProfileForm, 'email'>
                    control={control}
                    name="email"
                    label="Email"
                    autoCapitalize="none"
                    rules={{ required: 'Email wajib diisi' }}
                />

                <FormField.PaperInput<ProfileForm, 'name'>
                    control={control}
                    name="name"
                    label="Nama"
                    autoCapitalize="none"
                    rules={{ required: 'Nama wajib diisi' }}
                />

                <FormField.PaperInput<ProfileForm, 'phone_number'>
                    control={control}
                    name="phone_number"
                    label="No Hp"
                    autoCapitalize="none"
                    keyboardType="phone-pad"
                    maxLength={15}
                    textContentType="telephoneNumber"
                    rules={{ required: 'No Hp wajib diisi' }}
                />

                <FormField.PaperInput<ProfileForm, 'address'>
                    control={control}
                    name="address"
                    label="Alamat"
                    autoCapitalize="none"
                />

                <Button
                    mode="contained"
                    style={styles.submitButton}
                    onPress={handleSubmit(handleSave)}
                >
                    Simpan
                </Button>

                <Button
                    mode="contained"
                    onPress={() => router.push('/changePassword')}
                >
                    Ubah Password
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
    card: {
        padding: 16,
        borderRadius: 12,
    },
    sectionTitle: {
        marginBottom: 12,
    },
    logoBox: {
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderStyle: 'dashed',
    },
    logo: {
        width: 140,
        height: 100,
    },
    input: {
        marginBottom: 12,
    },
    inputText: {
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
    submitButton: {
        marginBottom: 8,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredText: {
        marginTop: 8,
        opacity: 0.7,
    },
    helperText: {
        marginBottom: 8,
        opacity: 0.7,
    },
})

export default Profile
