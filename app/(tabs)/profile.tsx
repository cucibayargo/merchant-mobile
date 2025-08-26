import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
    View,
    StyleSheet,
    ScrollView,
    Image,
    KeyboardAvoidingView,
    Platform,
    Alert,
    PermissionsAndroid,
    Linking,
} from 'react-native'
import {
    Text,
    TextInput,
    Button,
    Surface,
    ActivityIndicator,
} from 'react-native-paper'
import { launchImageLibrary } from 'react-native-image-picker'
import { useUser } from '@/context/user'
// import api from '../../services/api'
import * as ImagePicker from 'expo-image-picker'
import { ImagePickerAsset } from 'expo-image-picker'
import useUploadLogo from '@/hooks/profile/useUploadLogo'

type UpdateUserPayload = {
    logo?: string
    name: string
    email: string
    phone_number: string
    address: string
}

const AccountScreen = () => {
    const { user, setUser } = useUser()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [address, setAddress] = useState('')

    const [logoUri, setLogoUri] = useState<string>('')
    const [uploadedLogoPath, setUploadedLogoPath] = useState<string>('')

    const [submitting, setSubmitting] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(false)
    const { mutateAsync: uploadLogo } = useUploadLogo()

    const canSubmit = useMemo(() => {
        return !!name && !!email && !!phoneNumber
    }, [name, email, phoneNumber])

    useEffect(() => {
        setLoading(true)
        try {
            if (user) {
                setName(user.name || '')
                setEmail(user.email || '')
            }
        } finally {
            setLoading(false)
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
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        })
        if (result.canceled) return { ok: false, reason: 'canceled' }

        return result.assets[0]
    }

    const handlePickLogo = async () => {
        if (Platform.OS === 'android') {
            console.log('android')
            const file: ImagePickerAsset =
                await requestAndroidGalleryPermission()
            if (!file) {
                Alert.alert(
                    'Izin Ditolak',
                    'Tidak dapat mengakses galeri tanpa izin.'
                )
                return
            }

            console.log(file)
            setLogoUri(file.uri)
            setUploading(true)
        }
    }

    const handleSave = async () => {
        if (!user?.id) {
            Alert.alert('Gagal', 'Data pengguna tidak ditemukan.')
            return
        }
        if (!canSubmit) {
            Alert.alert('Validasi', 'Nama, Email, dan No HP wajib diisi.')
            return
        }

        setSubmitting(true)
        try {
            const payload: UpdateUserPayload = {
                logo: uploadedLogoPath || undefined,
                name,
                email,
                phone_number: phoneNumber,
                address,
            }

            // const response = await api.put(`/user/${user.id}`, payload)
            // const updatedUser =
            //     response?.data?.data?.user || response?.data?.user
            // if (updatedUser) {
            //     setUser(updatedUser)
            //     setUploadedLogoPath('')
            //     Alert.alert('Sukses', 'Akun berhasil diperbarui.')
            // } else {
            //     Alert.alert('Sukses', 'Perubahan disimpan.')
            // }
        } catch (error: any) {
            Alert.alert(
                'Gagal',
                error?.response?.data?.message ||
                    'Tidak dapat menyimpan perubahan.'
            )
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text style={styles.centeredText}>Memuat...</Text>
            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
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
                {uploading ? (
                    <Text style={styles.helperText}>Mengunggah logo...</Text>
                ) : uploadedLogoPath ? (
                    <Text style={styles.helperText}>Logo siap disimpan</Text>
                ) : null}

                <TextInput
                    label="Nama"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    style={[styles.input, styles.inputText]}
                />

                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                />

                <TextInput
                    label="No HP"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    mode="outlined"
                    keyboardType="phone-pad"
                    style={styles.input}
                />

                <TextInput
                    label="Alamat"
                    value={address}
                    onChangeText={setAddress}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    style={styles.input}
                />

                <Button
                    mode="contained"
                    onPress={handleSave}
                    disabled={submitting || uploading || !canSubmit}
                    loading={submitting}
                    style={styles.submitButton}
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
        marginTop: 4,
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

export default AccountScreen
