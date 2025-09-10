import customerIcon from '@/assets/images/customer-icon.png'
import durationIcon from '@/assets/images/duration-icon.png'
import moreIcon from '@/assets/images/more-icon.png'
import noteIcon from '@/assets/images/note-icon.png'
import reportIcon from '@/assets/images/report-icon.png'
import serviceIcon from '@/assets/images/service-icon.png'
import OrderCard from '@/components/orderCard'
import { useUser } from '@/context/user'
import useGetOrders from '@/hooks/order/useGetOrders'
import { useIsFocused } from '@react-navigation/core'
import { useRouter } from 'expo-router'
import { Clock10, Shapes, Users } from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, Image, StyleSheet, View } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { Avatar, Card, Text, TouchableRipple } from 'react-native-paper'

type Service = {
    id: string
    title: string
    badge?: string // e.g. "ONLY5K", "-75%", "30MINS"
    icon: any
    onPress?: () => void
}

const ServiceTile = ({ item }: { item: Service }) => {
    return (
        <TouchableRipple
            onPress={item.onPress || (() => {})}
            borderless
            style={styles.tilePressable}
        >
            <Card mode="contained" style={styles.tileCard}>
                {/*<View*/}
                {/*    style={[*/}
                {/*        styles.iconWrap,*/}
                {/*        { backgroundColor: item.icon.background },*/}
                {/*    ]}*/}
                {/*>*/}
                {/*     ribbon-ish badge */}
                {/*    {item.badge ? (*/}
                {/*        <>*/}
                {/*            <View style={styles.ribbonRed} />*/}
                {/*            <View style={styles.badge}>*/}
                {/*                <Text*/}
                {/*                    variant="labelSmall"*/}
                {/*                    style={styles.badgeText}*/}
                {/*                >*/}
                {/*                    {item.badge}*/}
                {/*                </Text>*/}
                {/*            </View>*/}
                {/*        </>*/}
                {/*    ) : null}*/}

                {/*    <Avatar.Icon*/}
                {/*        size={48}*/}
                {/*        icon={({ size, color }) => (*/}
                {/*            <MaterialCommunityIcons*/}
                {/*                name={item.icon.name as any}*/}
                {/*                size={size}*/}
                {/*                color={color}*/}
                {/*            />*/}
                {/*        )}*/}
                {/*        style={styles.avatar}*/}
                {/*        color="#1C1C1C"*/}
                {/*        // backgroundColor="transparent"*/}
                {/*    />*/}
                {/*</View>*/}

                <Image source={item.icon} style={styles.iconWrap} />

                <Text
                    variant="titleSmall"
                    style={styles.title}
                    numberOfLines={1}
                >
                    {item.title}
                </Text>
            </Card>
        </TouchableRipple>
    )
}

const Home = () => {
    const { user } = useUser()
    const menus = [
        {
            icon: <Users />,
            route: 'Home',
        },
        {
            icon: <Clock10 />,
            route: 'Home',
        },
        {
            icon: <Shapes />,
            route: 'Home',
        },
    ]
    const [orders, setOrders] = useState<IOngoingOrder[]>([])
    const { data, isLoading, refetch } = useGetOrders({
        status: 'Diproses',
        filter: '',
        limit: 3,
        page: 1,
    })
    const isFocused = useIsFocused()
    const router = useRouter()
    const SERVICES: Service[] = [
        {
            id: 'services',
            title: 'Layanan',
            badge: 'ONLY5K',
            icon: serviceIcon,
            onPress: () => {
                router.push('/service')
            },
        },
        {
            id: 'duration',
            title: 'Durasi',
            badge: 'ONLY6K',
            icon: durationIcon,
            onPress: () => {
                router.push('/duration')
            },
        },
        {
            id: 'customer',
            title: 'Pelanggan',
            badge: '-75%',
            icon: customerIcon,
        },
        {
            id: 'report',
            title: 'Loporan',
            badge: 'FLAT5K',
            icon: reportIcon,
        },
        {
            id: 'note',
            title: 'Ketentuan',
            badge: '30MINS',
            icon: noteIcon,
        },
        {
            id: 'more',
            title: 'Lainnya',
            icon: moreIcon,
        },
    ]

    useEffect(() => {
        if (isFocused) {
            refetch()
        }
    }, [isFocused])

    useEffect(() => {
        if (data) {
            setOrders(data?.data?.transactions)
        }
    }, [data])

    return (
        <View style={styles.container}>
            <Spinner visible={isLoading} />

            <View style={styles.topElement}>
                <View>
                    <Text style={styles.greeting}>Selamat Pagi</Text>
                    <Text style={styles.username}>{user?.name}</Text>
                </View>

                <View>
                    {user?.logo ? (
                        <Avatar.Image size={30} source={{ uri: user.logo }} />
                    ) : (
                        <Avatar.Text size={24} label="XD" />
                    )}
                </View>
            </View>

            <FlatList
                data={orders}
                keyExtractor={(o) => String(o.id)}
                renderItem={({ item }) => (
                    <OrderCard
                        idx={Number(item.id)}
                        key={item.id}
                        type="Diproses"
                        data={item}
                    />
                )}
                // Services grid at the top
                ListHeaderComponent={
                    <View>
                        <FlatList
                            data={SERVICES}
                            keyExtractor={(i) => i.id}
                            numColumns={3}
                            columnWrapperStyle={styles.row}
                            contentContainerStyle={styles.listPad}
                            renderItem={({ item }) => (
                                <ServiceTile item={item} />
                            )}
                            scrollEnabled={false} // header list shouldn't scroll
                        />

                        <Text style={styles.orderTitle}>
                            Order yang Diproses
                        </Text>
                    </View>
                }
                // Make sure you don't pin content to the bottom:
                contentContainerStyle={{ paddingBottom: 16 }}
                // inverted={false} // (default) ensure not inverted
            />

            {/*<FlatList*/}
            {/*    data={SERVICES}*/}
            {/*    keyExtractor={(i) => i.id}*/}
            {/*    numColumns={3}*/}
            {/*    columnWrapperStyle={styles.row}*/}
            {/*    contentContainerStyle={styles.listPad}*/}
            {/*    renderItem={({ item }) => <ServiceTile item={item} />}*/}
            {/*/>*/}

            {/*{orders.map((order: IOngoingOrder) => (*/}
            {/*    <OrderCard*/}
            {/*        idx={Number(order.id)}*/}
            {/*        key={order.id}*/}
            {/*        type="Diproses"*/}
            {/*        data={order}*/}
            {/*        // openConfirmationDialog={() => {*/}
            {/*        //     setConfirmationDialogCounter(confirmationDialogCounter + 1)*/}
            {/*        //     setSelectedInvoiceForUpdate(item.invoice)*/}
            {/*        // }}*/}
            {/*    />*/}
            {/*))}*/}
        </View>
    )
}

const TILE_SIZE = 80

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    topElement: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    greeting: {
        fontSize: 15,
        fontWeight: 'semibold',
        // marginBottom: 10,
        color: 'black',
    },
    username: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'black',
    },
    menuContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    listPad: { paddingTop: 16 },
    row: { justifyContent: 'space-between', marginBottom: 18 },
    tilePressable: { width: '24%' }, // 4 columns with spacing
    tileCard: {
        alignItems: 'center',
        paddingVertical: 6,
        backgroundColor: 'transparent',
        shadowColor: 'transparent',
    },
    iconWrap: {
        width: TILE_SIZE,
        height: TILE_SIZE,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    avatar: { backgroundColor: 'transparent' },
    title: { marginTop: 0, textAlign: 'center' },
    orderTitle: {
        marginTop: 10,
        marginBottom: 15,
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Badge + ribbon
    badge: {
        position: 'absolute',
        top: -8,
        left: -8,
        backgroundColor: '#111',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        zIndex: 2,
    },
    badgeText: { color: '#fff', fontWeight: '700', letterSpacing: 0.2 },
    ribbonRed: {
        position: 'absolute',
        top: 6,
        left: -6,
        right: -6,
        height: 8,
        backgroundColor: '#E21',
        borderRadius: 4,
        zIndex: 1,
    },
})

export default Home
