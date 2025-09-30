import React, { memo } from 'react'
import { Pressable, Text, View } from 'react-native'
// import { styled } from 'nativewind'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackNavigationProp } from '@react-navigation/stack'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useRouter } from 'expo-router'

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
    const router = useRouter()

    const handleCardPress = () => {
        router.push({
            pathname: '/(tabs)/order/[id]',
            params: { id: String(data.invoice) },
        } as never)
    }

    const handleChecklistPress = async () => {
        if (
            data.payment_status === 'Belum Dibayar' &&
            data.status === 'Siap Diambil'
        ) {
            await AsyncStorage.setItem('orderMode', 'orders')
            return
        }

        if (openConfirmationDialog) {
            openConfirmationDialog()
        }
    }

    const isPaid = data.payment_status === 'Lunas'

    return (
        <Pressable
            style={{
                borderWidth: 1,
                backgroundColor: 'white',
                marginBottom: 8,
                borderColor: isPaid ? '#75b855' : '#db6161',
                borderRadius: 10,
            }}
            onPress={handleCardPress}
            accessibilityLabel={`order-${idx + 1}`}
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 12,
                    alignItems: 'center',
                }}
            >
                <Text style={{ fontWeight: 700 }}>{data.invoice}</Text>
                {type !== 'Selesai' ? (
                    <Pressable
                        onPress={handleChecklistPress}
                        hitSlop={8}
                        accessibilityLabel="checklist-btn"
                    ></Pressable>
                ) : (
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: 200,
                            marginTop: 'auto',
                        }}
                    >
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

            <View
                style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    justifyContent: 'space-between',
                    borderBottomStartRadius: 10,
                }}
            >
                <View>
                    <Text style={{ fontSize: 14, fontWeight: 200 }}>
                        {data.customer}
                    </Text>
                    <Text
                        style={{
                            fontSize: 14,
                            color: isPaid ? '#75b855' : '#db6161',
                        }}
                    >
                        {data.payment_status}
                    </Text>
                </View>

                {type === 'Diproses' && (
                    <Text
                        className="text-sm font-thin mt-auto"
                        style={{
                            fontSize: 14,
                            fontWeight: 200,
                            marginTop: 'auto',
                        }}
                    >
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
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: 100,
                            marginTop: 'auto',
                        }}
                    >
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
