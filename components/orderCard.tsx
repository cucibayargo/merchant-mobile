import React, { memo } from 'react'
import { View, Pressable, Text } from 'react-native'
// import { styled } from 'nativewind'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

type Navigation = StackNavigationProp<RootStackParamList, 'Main'>

// const View = styled(RNView)
// const Pressable = styled(RNPressable)
// const Text = styled(RNText)

const OrderCard = ({
    type,
    data,
    idx,
    openConfirmationDialog,
}: IOrderCardProps) => {
    const navigation = useNavigation<Navigation>()

    const handleCardPress = () => {
        navigation.navigate('OrderDetails', { orderId: data.id })
    }

    const handleChecklistPress = async () => {
        if (
            data.payment_status === 'Belum Dibayar' &&
            data.status === 'Siap Diambil'
        ) {
            await AsyncStorage.setItem('orderMode', 'orders')
            navigation.navigate('Payment', { invoice: data.invoice })
            return
        }

        if (openConfirmationDialog) {
            openConfirmationDialog()
        }
    }

    const isPaid = data.payment_status === 'Lunas'

    return (
        <Pressable
            className={`border rounded-md bg-white shadow-md mb-2 ${
                isPaid ? 'border-watermelon-2' : 'border-watermelon-4'
            }`}
            onPress={handleCardPress}
            accessibilityLabel={`order-${idx + 1}`}
        >
            <View className="flex-row justify-between p-3 items-center">
                <Text className="font-bold">{data.invoice}</Text>
                {type !== 'Selesai' ? (
                    <Pressable
                        onPress={handleChecklistPress}
                        hitSlop={8}
                        accessibilityLabel="checklist-btn"
                    ></Pressable>
                ) : (
                    <Text className="text-sm font-thin mt-auto">
                        {format(
                            new Date(data.completed_at),
                            'dd MMM yyyy HH:mm',
                            {
                                locale: id,
                            }
                        )}
                    </Text>
                )}
            </View>

            <View className="bg-gray-2 px-4 py-2 flex-row justify-between rounded-b-sm">
                <View>
                    <Text className="text-sm font-thin">{data.customer}</Text>
                    <Text
                        className={`text-sm ${
                            isPaid ? 'text-watermelon-2' : 'text-watermelon-4'
                        }`}
                    >
                        {data.payment_status}
                    </Text>
                </View>

                {type === 'Diproses' && (
                    <Text className="text-sm font-thin mt-auto">
                        {format(
                            new Date(data.estimated_date),
                            'dd MMM yyyy dd:mm',
                            {
                                locale: id,
                            }
                        )}
                    </Text>
                )}

                {type === 'Siap Diambil' && (
                    <Text className="text-sm font-thin mt-auto">
                        {format(
                            new Date(data.ready_to_pick_up_at),
                            'dd MMM yyyy',
                            {
                                locale: id,
                            }
                        )}
                    </Text>
                )}
            </View>
        </Pressable>
    )
}

export default memo(OrderCard)
