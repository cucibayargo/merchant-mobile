import useGetOrder from '@/hooks/order/useGetOrder'
import { IOrder } from '@/types/order'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { format } from 'date-fns'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
    ChevronLeft,
    MapPin,
    MessageCircle,
    Phone,
    Printer,
    Receipt,
    User2,
} from 'lucide-react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Pressable, ScrollView, View } from 'react-native'
import { Text } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const OrderDetail = () => {
    const navigation = useNavigation()
    const router = useRouter()
    const { id } = useLocalSearchParams<{ id: string }>()
    const insets = useSafeAreaInsets()
    const { data: orderResponse, isLoading, isFetching } = useGetOrder(id)
    const [order, setOrder] = useState<IOrder>({
        transaction_id: '',
        customer_id: '',
        customer_name: '',
        customer_address: '',
        customer_phone_number: '',
        ready_to_pick_up_at: '',
        completed_at: '',
        estimated_date: '',
        created_at: '',
        note: '',
        duration_name: '',
        transaction_status: '',
        invoice: '',
        total: 0,
        payment_status: '',
        payment_id: '',
        services: [],
    })

    useFocusEffect(
        React.useCallback(() => {
            const parent = navigation.getParent()
            parent?.setOptions({ tabBarStyle: { display: 'none' } })

            return () => {
                parent?.setOptions({ tabBarStyle: undefined })
            }
        }, [navigation])
    )

    useEffect(() => {
        if (orderResponse) {
            setOrder(orderResponse.data)
        }
    }, [orderResponse])

    const DetailRow = ({ label, value }: { label: string; value: string }) => (
        <View style={{ marginBottom: 12 }}>
            <Text style={{ color: '#6B7280', fontSize: 12 }}>{label}</Text>
            <Text style={{ color: '#111827', fontWeight: '600', marginTop: 2 }}>
                {value}
            </Text>
        </View>
    )

    const shimmer = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmer, {
                toValue: 1,
                duration: 1200,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start()
    }, [shimmer])

    const SkeletonBlock = ({
        height,
        width,
        style,
    }: {
        height: number
        width: number | string
        style?: any
    }) => {
        const translateX = shimmer.interpolate({
            inputRange: [0, 1],
            outputRange: [-100, 600],
        })

        return (
            <View
                style={[
                    {
                        height,
                        width,
                        backgroundColor: '#E5E7EB',
                        borderRadius: 8,
                        overflow: 'hidden',
                    },
                    style,
                ]}
            >
                <Animated.View
                    pointerEvents="none"
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        width: 80,
                        opacity: 0.5,
                        backgroundColor: '#FFFFFF',
                        transform: [{ translateX }],
                    }}
                />
            </View>
        )
    }

    const renderSkeleton = () => (
        <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            <View
                style={{
                    backgroundColor: '#ffffff',
                    paddingTop: 48,
                    paddingHorizontal: 16,
                    paddingBottom: 12,
                    borderBottomWidth: 1,
                    borderColor: '#E5E7EB',
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <SkeletonBlock
                        height={28}
                        width={28}
                        style={{ borderRadius: 999 }}
                    />
                    <SkeletonBlock
                        height={18}
                        width={160}
                        style={{ marginLeft: 8, borderRadius: 4 }}
                    />
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 16,
                    paddingBottom: (insets.bottom || 0) + 120,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 12,
                    }}
                >
                    <SkeletonBlock
                        height={32}
                        width={160}
                        style={{ borderRadius: 999 }}
                    />
                    <View style={{ flexDirection: 'row' }}>
                        <SkeletonBlock
                            height={40}
                            width={40}
                            style={{ borderRadius: 999, marginRight: 8 }}
                        />
                        <SkeletonBlock
                            height={40}
                            width={40}
                            style={{ borderRadius: 999 }}
                        />
                    </View>
                </View>

                <View
                    style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 16,
                        shadowColor: '#000',
                        shadowOpacity: 0.04,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 1,
                    }}
                >
                    <SkeletonBlock height={16} width={200} />
                    <SkeletonBlock
                        height={16}
                        width={160}
                        style={{ marginTop: 12 }}
                    />
                    <SkeletonBlock
                        height={16}
                        width={'80%'}
                        style={{ marginTop: 12 }}
                    />
                </View>

                <View
                    style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 12,
                        padding: 12,
                        marginBottom: 16,
                        shadowColor: '#000',
                        shadowOpacity: 0.04,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 1,
                    }}
                >
                    {[0, 1, 2].map((i) => (
                        <View
                            key={i}
                            style={{
                                paddingVertical: 12,
                                borderBottomWidth: i !== 2 ? 1 : 0,
                                borderColor: '#F3F4F6',
                            }}
                        >
                            <SkeletonBlock height={18} width={200} />
                            <SkeletonBlock
                                height={14}
                                width={120}
                                style={{ marginTop: 6 }}
                            />
                        </View>
                    ))}
                </View>

                <View
                    style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 32,
                        shadowColor: '#000',
                        shadowOpacity: 0.04,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 1,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            gap: 12,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <SkeletonBlock height={12} width={120} />
                            <SkeletonBlock
                                height={16}
                                width={'80%'}
                                style={{ marginTop: 8 }}
                            />
                            <SkeletonBlock
                                height={12}
                                width={100}
                                style={{ marginTop: 16 }}
                            />
                            <SkeletonBlock
                                height={16}
                                width={'70%'}
                                style={{ marginTop: 8 }}
                            />
                            <SkeletonBlock
                                height={12}
                                width={80}
                                style={{ marginTop: 16 }}
                            />
                            <SkeletonBlock
                                height={16}
                                width={'60%'}
                                style={{ marginTop: 8 }}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <SkeletonBlock height={12} width={120} />
                            <SkeletonBlock
                                height={16}
                                width={'75%'}
                                style={{ marginTop: 8 }}
                            />
                            <SkeletonBlock
                                height={12}
                                width={140}
                                style={{ marginTop: 16 }}
                            />
                            <SkeletonBlock
                                height={16}
                                width={'65%'}
                                style={{ marginTop: 8 }}
                            />
                            <SkeletonBlock
                                height={12}
                                width={100}
                                style={{ marginTop: 16 }}
                            />
                            <SkeletonBlock
                                height={16}
                                width={'50%'}
                                style={{ marginTop: 8 }}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#ffffff',
                    paddingHorizontal: 16,
                    paddingTop: 12,
                    paddingBottom: insets.bottom || 20,
                    borderTopWidth: 1,
                    borderColor: '#E5E7EB',
                    shadowColor: '#000',
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: -2 },
                    elevation: 6,
                    zIndex: 10,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <View>
                        <SkeletonBlock
                            height={12}
                            width={40}
                            style={{ borderRadius: 4 }}
                        />
                        <SkeletonBlock
                            height={18}
                            width={120}
                            style={{ marginTop: 6 }}
                        />
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <SkeletonBlock
                            height={12}
                            width={120}
                            style={{ borderRadius: 4 }}
                        />
                        <SkeletonBlock
                            height={16}
                            width={100}
                            style={{ marginTop: 6 }}
                        />
                    </View>
                </View>
            </View>
        </View>
    )

    if (isLoading || isFetching) {
        return renderSkeleton()
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            {/* Top bar */}
            <View
                style={{
                    backgroundColor: '#ffffff',
                    paddingTop: 48,
                    paddingHorizontal: 16,
                    paddingBottom: 12,
                    borderBottomWidth: 1,
                    borderColor: '#E5E7EB',
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Pressable onPress={() => router.back()} hitSlop={8}>
                        <ChevronLeft color="#111827" size={28} />
                    </Pressable>
                    <Text
                        style={{
                            marginLeft: 8,
                            fontSize: 18,
                            fontWeight: '700',
                        }}
                    >
                        Rincian Pesanan
                    </Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 16,
                    paddingBottom: (insets.bottom || 0) + 120,
                }}
            >
                {/* Invoice row */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 12,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#EEF2FF',
                            borderRadius: 999,
                            paddingVertical: 6,
                            paddingHorizontal: 10,
                        }}
                    >
                        <Receipt size={16} color="#4338CA" />
                        <Text
                            style={{
                                color: '#4338CA',
                                marginLeft: 6,
                                fontWeight: '700',
                            }}
                        >
                            {order?.invoice}
                        </Text>
                    </View>

                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                        <Pressable
                            onPress={() => {
                                /* open WhatsApp */
                            }}
                            hitSlop={8}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 999,
                                backgroundColor: '#22C55E',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 8,
                            }}
                        >
                            <MessageCircle size={20} color="#ffffff" />
                        </Pressable>

                        <Pressable
                            onPress={() => {
                                /* trigger print */
                            }}
                            hitSlop={8}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 999,
                                backgroundColor: '#3B82F6',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Printer size={20} color="#ffffff" />
                        </Pressable>
                    </View>
                </View>

                {/* Customer card */}
                <View
                    style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 16,
                        shadowColor: '#000',
                        shadowOpacity: 0.04,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 1,
                    }}
                >
                    <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                        <User2 color="#6B7280" size={18} />
                        <Text style={{ marginLeft: 8 }}>
                            {order?.customer_name}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 8,
                        }}
                    >
                        <Phone color="#6B7280" size={18} />
                        <Text style={{ marginLeft: 8 }}>
                            {order?.customer_phone_number}
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 6,
                        }}
                    >
                        <MapPin color="#6B7280" size={18} />
                        <Text style={{ marginLeft: 8, color: '#6B7280' }}>
                            {order?.customer_address !== ''
                                ? order?.customer_address
                                : 'Tidak ada alamat'}
                        </Text>
                    </View>
                </View>

                {/* Items */}
                <View
                    style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 12,
                        padding: 12,
                        marginBottom: 16,
                        shadowColor: '#000',
                        shadowOpacity: 0.04,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 1,
                    }}
                >
                    {order?.services.map((it, idx) => (
                        <View
                            key={`${it.service_name}-${idx}`}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingVertical: 12,
                                borderBottomWidth:
                                    idx !== order?.services.length - 1 ? 1 : 0,
                                borderColor: '#F3F4F6',
                            }}
                        >
                            <View style={{ maxWidth: '70%' }}>
                                <Text
                                    style={{ fontSize: 16, fontWeight: '700' }}
                                >
                                    {it.service_name}
                                </Text>
                                <Text
                                    style={{ color: '#6B7280', marginTop: 2 }}
                                >
                                    {order.duration_name} x Rp{' '}
                                    {it.price.toLocaleString('id-ID')}
                                </Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={{ color: '#6B7280' }}>Qty</Text>
                                <Text
                                    style={{ fontSize: 18, fontWeight: '700' }}
                                >
                                    {it.quantity} {it.service_unit}
                                </Text>
                                <Text style={{ marginTop: 4 }}>
                                    Rp {it.price.toLocaleString('id-ID')}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Details grid */}
                <View
                    style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 12,
                        padding: 16,
                        marginBottom: 32,
                        shadowColor: '#000',
                        shadowOpacity: 0.04,
                        shadowRadius: 8,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 1,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            gap: 12,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <DetailRow
                                label="Tanggal Masuk"
                                value={
                                    order?.created_at
                                        ? format(
                                              order?.created_at,
                                              'dd/MM/yyyy - hh:mm'
                                          )
                                        : '-'
                                }
                            />
                            <DetailRow
                                label="Tanggal Selesai"
                                value={
                                    order?.ready_to_pick_up_at
                                        ? format(
                                              order?.ready_to_pick_up_at,
                                              'dd/MM/yyyy - hh:mm'
                                          )
                                        : '-'
                                }
                            />
                            <DetailRow label="Status" value="status" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <DetailRow
                                label="Estimasi Selesai"
                                value={
                                    order?.estimated_date
                                        ? format(
                                              order?.estimated_date,
                                              'dd/MM/yyyy - hh:mm'
                                          )
                                        : '-'
                                }
                            />
                            <DetailRow
                                label="Tanggal Diambil"
                                value={
                                    order?.completed_at
                                        ? format(
                                              order?.completed_at,
                                              'dd/MM/yyyy - hh:mm'
                                          )
                                        : '-'
                                }
                            />
                            <DetailRow
                                label="Catatan"
                                value={order?.note !== '' ? order?.note : '-'}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Fixed bottom summary bar */}
            <View
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#ffffff',
                    paddingHorizontal: 16,
                    paddingTop: 12,
                    paddingBottom: insets.bottom || 20,
                    borderTopWidth: 1,
                    borderColor: '#E5E7EB',
                    shadowColor: '#000',
                    shadowOpacity: 0.06,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: -2 },
                    elevation: 6,
                    zIndex: 10,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <View>
                        <Text style={{ color: '#6B7280', fontSize: 12 }}>
                            Total
                        </Text>
                        <Text style={{ fontSize: 18, fontWeight: '700' }}>
                            Rp {order?.total.toLocaleString('id-ID')}
                        </Text>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ color: '#6B7280', fontSize: 12 }}>
                            Status Pembayaran
                        </Text>
                        <Text
                            style={{
                                fontWeight: '700',
                                color: order?.payment_status.startsWith('Lunas')
                                    ? '#16A34A'
                                    : '#DC2626',
                            }}
                        >
                            {order?.payment_status}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default OrderDetail
