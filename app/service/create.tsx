import { FormField } from '@/components/formInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { Button, Portal, Dialog } from 'react-native-paper'
import { z } from 'zod'
import useGetService from '@/hooks/service/useGetService'
import { Text } from 'react-native-paper'
import { Trash2, Pencil, Plus } from 'lucide-react-native'
import { IDurationFormData } from '@/types/service'
import useGetDurationList from '@/hooks/duration/useGetDurationList'
import useUpdateService from '@/hooks/service/useUpdateService'
import useCreateService from '@/hooks/service/useCreateService'

const DurationModal = ({
    visible,
    data,
    onSubmit,
    onClose,
}: IDurationFormProps) => {
    const formSchema = z.object({
        duration: z.string().min(1, { message: 'Durasi wajib diisi' }),
        price: z.number().min(1, { message: 'Harga wajib diisi' }),
    })
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, isValid },
        getValues,
    } = useForm<CustomForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            duration: '',
            price: '',
        },
        mode: 'onChange',
    })
    const { data: durationListResponse } = useGetDurationList({})
    const [durations, setDurations] = useState<IDropdown[]>([])

    useEffect(() => {
        if (data) {
            reset(data)
            console.log(data)
        }
    }, [data])

    useEffect(() => {
        if (durationListResponse) {
            setDurations(() =>
                durationListResponse.data.map((duration: IDuration) => ({
                    value: duration.id,
                    label: duration.name,
                }))
            )
        }
    }, [durationListResponse])

    return (
        <Portal>
            <Dialog visible={visible} style={{ backgroundColor: '#fff' }}>
                <Dialog.Title>Edit Durasi</Dialog.Title>
                <Dialog.Content>
                    <FormField.PaperSelect<CustomForm, 'duration'>
                        control={control}
                        name="duration"
                        label="Durasi"
                        options={durations}
                        disabled={data ? true : false}
                    />

                    <FormField.PaperNumber<CustomForm, 'price'>
                        control={control}
                        name="price"
                        label="Harga"
                        precision={0} // IDR usually no decimals
                        min={0}
                        thousandSeparator // 12,500
                        // left={<PaperInput.Affix text="Rp" />}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => onClose()}>Batal</Button>
                    <Button
                        onPress={() => {
                            const value = {
                                duration_name: durationListResponse?.data.find(
                                    (list) => list.id === getValues('duration')
                                ).name,
                                duration_id: getValues('duration'),
                                price: getValues('price'),
                            }
                            onSubmit(value)
                            onClose()
                        }}
                    >
                        Simpan
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}

export default function CreateService() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const formSchema = z.object({
        name: z.string().min(1, { message: 'Nama wajib diisi' }),
        unit: z.string().min(1, { message: 'Satuan wajib diisi' }),
    })
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, isValid },
        getValues,
        setValue,
    } = useForm<CustomForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            unit: '',
            durations: [],
        },
        mode: 'onChange',
    })
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'durations',
    })
    const { data, isLoading } = useGetService(id!)
    const { mutateAsync: createService, isPending: isPendingUpdate } =
        useCreateService()
    const [isShowDurationModal, setIsShowDurationModal] = useState(false)
    // const [durations, setDurations] = useState<IDurationFormData[]>([])
    const [selectedDuration, setSelectedDuration] =
        useState<IDurationFormData | null>(null)

    useEffect(() => {
        if (id) {
            reset(data?.data)
            // setDurations(data?.data.durations)
        }
    }, [data])

    const handleSave = async () => {
        let payload = getValues()
        payload.durations = payload.durations.map((duration) => ({
            duration: duration.duration_id,
            price: duration.price,
        }))
        console.log(payload)

        createService(payload)
    }

    const handleAddDuration = (data) => {
        if (
            getValues('durations').some(
                (duration) => duration.duration === data.duration_id
            )
        ) {
            const newDurations = getValues('durations').map((duration) => {
                if (duration.duration === data.duration_id) {
                    return {
                        ...duration,
                        price: data.price,
                    }
                }
                return duration
            })
            setValue('durations', newDurations)
        } else {
            const newDurations = [...getValues('durations'), data]
            setValue('durations', newDurations)
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Spinner visible={isLoading || isPendingUpdate} />

            <View className="p-4">
                <FormField.PaperInput<CustomForm, 'name'>
                    control={control}
                    name="name"
                    label="Nama"
                    autoCapitalize="none"
                />

                <FormField.PaperInput<CustomForm, 'unit'>
                    control={control}
                    name="unit"
                    label="Satuan"
                    autoCapitalize="none"
                />

                <Text
                    style={{
                        marginBottom: 10,
                        fontWeight: '700',
                        fontSize: 16,
                    }}
                >
                    Durasi
                </Text>

                <FlatList
                    data={fields}
                    keyExtractor={(item) => item.id}
                    extraData={fields}
                    renderItem={({ item, index }) => (
                        <View
                            key={index}
                            style={{
                                paddingVertical: 5,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        fontWeight: '700',
                                        fontSize: 16,
                                    }}
                                >
                                    {getValues(
                                        `durations.${index}.duration_name`
                                    )}
                                </Text>
                                <Text>
                                    Rp {getValues(`durations.${index}.price`)}
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                <Pencil
                                    style={{ marginVertical: 'auto' }}
                                    strokeWidth={1}
                                    color={'#2958a3'}
                                    onPress={() => {
                                        setIsShowDurationModal(true)
                                        setSelectedDuration({
                                            duration: getValues(
                                                `durations.${index}.duration`
                                            ),
                                            price: getValues(
                                                `durations.${index}.price`
                                            ),
                                        })
                                    }}
                                />
                                <Trash2
                                    style={{ marginVertical: 'auto' }}
                                    strokeWidth={1}
                                    color={'#a33929'}
                                    onPress={() => remove(index)}
                                />
                            </View>
                        </View>
                    )}
                />

                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        backgroundColor: '#29a35e',
                        borderRadius: 10,
                        padding: 4,
                        width: 100,
                        marginRight: 3,
                        marginLeft: 'auto',
                        marginTop: 10,
                    }}
                    onPress={() => {
                        setIsShowDurationModal(true)
                        setSelectedDuration(null)
                    }}
                >
                    <Plus size={15} color={'#fff'} />
                    <Text style={{ fontSize: 10, color: '#fff' }}>
                        Tambah Durasi
                    </Text>
                </TouchableOpacity>

                <Button
                    mode="contained"
                    style={{ marginTop: 30 }}
                    onPress={handleSubmit(handleSave)}
                >
                    Simpan
                </Button>
            </View>

            <DurationModal
                visible={isShowDurationModal}
                data={selectedDuration}
                onSubmit={handleAddDuration}
                onClose={() => {
                    setIsShowDurationModal(false)
                    setSelectedDuration(null)
                }}
            />
        </SafeAreaView>
    )
}
