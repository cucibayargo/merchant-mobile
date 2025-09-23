import React from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import { images } from '@/constans/images'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useSignup from '@/hooks/auth/useSignup'
import Spinner from 'react-native-loading-spinner-overlay'

const PlanCard = ({
    data,
    key,
    onPress,
}: {
    data: IPricingPlan
    key: number
    onPress: (plan: IPricingPlan) => void
}) => {
    return (
        <TouchableOpacity
            style={{
                borderRadius: 8,
                padding: 20,
                marginBottom: 20,
                backgroundColor: 'white',
            }}
            onPress={() => onPress(data)}
            key={key}
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <Text style={{ fontWeight: 700, fontSize: 18 }}>
                    {data.title}
                </Text>
                <Text>Rp. {data.price}</Text>
            </View>

            {data.features.map((feature, index) => (
                <View
                    key={index}
                    style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}
                >
                    <Image source={images.checkIcon} alt="check" />
                    <Text>{feature}</Text>
                </View>
            ))}
        </TouchableOpacity>
    )
}

const ChoosePlan = () => {
    const pricingPlan: IPricingPlan[] = [
        {
            title: 'Gratis',
            value: 'gratis',
            features: [
                'Unlimited Transaksi',
                'Unlimited Data Pelanggan',
                'Unlimited Layanan',
                'Unlimited Durasi Layanan',
                'Masa Berlaku 14 Hari',
            ],
            price: '0',
            isPopular: false,
        },
        {
            title: 'Paket 1 Bulan',
            value: '1bulan',
            features: [
                'Unlimited Transaksi',
                'Unlimited Data Pelanggan',
                'Unlimited Layanan',
                'Masa Berlaku 30 Hari',
            ],
            price: '45.000',
            isPopular: true,
        },
        {
            title: 'Paket 3 Bulan',
            value: '3bulan',
            features: [
                'Unlimited Transaksi',
                'Unlimited Data Pelanggan',
                'Unlimited Layanan',
                'Masa Berlaku 90 Hari',
            ],
            price: '125.000',
            isPopular: false,
        },
        {
            title: 'Paket 6 Bulan',
            value: '6bulan',
            features: [
                'Unlimited Transaksi',
                'Unlimited Data Pelanggan',
                'Unlimited Layanan',
                'Masa Berlaku 180 Hari',
            ],
            price: '260.000',
            isPopular: false,
        },
        {
            title: 'Paket 12 Bulan',
            value: '12bulan',
            features: [
                'Unlimited Transaksi',
                'Unlimited Data Pelanggan',
                'Unlimited Layanan',
                'Masa Berlaku 360 Hari',
            ],
            price: '530.000',
            isPopular: false,
        },
    ]

    const { mutateAsync: signup, isPending } = useSignup()

    const handleClickPlanCard = async (plan: IPricingPlan) => {
        try {
            const signupData = await AsyncStorage.getItem('signupData')

            if (signupData) {
                signup({
                    ...JSON.parse(signupData),
                    subscription_plan: plan.value,
                })
            }
        } catch (e) {
            console.log('error', e)
        }
    }

    return (
        <ScrollView>
            <Spinner visible={isPending} />

            <View style={{ paddingVertical: 64, paddingHorizontal: 20 }}>
                <Text
                    style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}
                >
                    Pilih Paket
                </Text>
                {pricingPlan.map((plan, index) => (
                    <PlanCard
                        data={plan}
                        key={index}
                        onPress={handleClickPlanCard}
                    />
                ))}
            </View>
        </ScrollView>
    )
}

export default ChoosePlan
