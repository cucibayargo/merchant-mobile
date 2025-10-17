import AsyncStorage from '@react-native-async-storage/async-storage'
import { StackNavigationProp } from '@react-navigation/stack'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useRouter } from 'expo-router'
import { CalendarDaysIcon, ThumbsDown, ThumbsUp } from 'lucide-react-native'
import { memo } from 'react'
import { Pressable, View } from 'react-native'
import { Text } from 'react-native-paper'

type Navigation = StackNavigationProp<RootStackParamList, 'Main'>

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
                backgroundColor: 'white',
                paddingHorizontal: 10,
                paddingVertical: 8,
            }}
            onPress={handleCardPress}
            accessibilityLabel={`order-${idx + 1}`}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                }}
            >
                <Text style={{ fontSize: 18, fontWeight: 700 }}>
                    {data.customer}
                </Text>
            </View>

            <Text style={{ fontSize: 16, color: '#9CA3AF', marginBottom: 4 }}>
                {data.invoice}
            </Text>

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 20,
                    marginBottom: 14,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                    }}
                >
                    <CalendarDaysIcon color="#111827" size={12} />
                    <Text style={{ fontSize: 12 }}>
                        {format(
                            new Date(data.created_at),
                            'dd MMM yyyy HH:mm',
                            {
                                locale: id,
                            }
                        )}
                    </Text>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                    }}
                >
                    {isPaid ? (
                        <ThumbsUp color="#75b855" size={12} />
                    ) : (
                        <ThumbsDown color="#ff3b30" size={12} />
                    )}
                    <Text
                        style={{
                            fontSize: 12,
                            color: isPaid ? '#75b855' : '#ff3b30',
                        }}
                    >
                        {data.payment_status}
                    </Text>
                </View>
            </View>

            {type === 'Selesai' && (
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: 200,
                    }}
                >
                    {format(new Date(data.completed_at), 'dd MMM yyyy HH:mm', {
                        locale: id,
                    })}
                </Text>
            )}

            <View
                style={{ height: 1, backgroundColor: '#E5E7EB', marginTop: 4 }}
            />
        </Pressable>
    )
}

export default memo(OrderCard)
