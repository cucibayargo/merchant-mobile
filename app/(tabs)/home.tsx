import customerIcon from '@/assets/images/customer-icon.png'
import durationIcon from '@/assets/images/duration-icon.png'
import moreIcon from '@/assets/images/more-icon.png'
import noteIcon from '@/assets/images/note-icon.png'
import reportIcon from '@/assets/images/report-icon.png'
import serviceIcon from '@/assets/images/service-icon.png'
import faqIcon from '@/assets/images/faq-icon.png'
import supportIcon from '@/assets/images/support-icon.png'
import aboutIcon from '@/assets/images/about-icon.png'
import OrderCard from '@/components/orderCard'
import { useUser } from '@/context/user'
import useGetOrders from '@/hooks/order/useGetOrders'
import { useIsFocused } from '@react-navigation/core'
import { useRouter } from 'expo-router'
import { Clock10, Shapes, Users } from 'lucide-react-native'
import React, { useCallback, useEffect, useState } from 'react'
import {
    FlatList,
    Image,
    Platform,
    StyleSheet,
    View,
    Modal,
    Linking,
    Alert,
} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import {
    Avatar,
    Card,
    Divider,
    // Modal,
    Portal,
    Text,
    TouchableRipple,
    Button,
} from 'react-native-paper'
// import DateTimePicker, {
//     DateType,
//     useDefaultStyles,
// } from 'react-native-ui-datepicker'
import {
    DatePickerModal,
    id,
    registerTranslation,
} from 'react-native-paper-dates'
import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker'
import { getLocales } from 'expo-localization'
import { SafeAreaView } from 'react-native-safe-area-context'
import Constants from 'expo-constants'
import { BottomDrawer } from '@/components/bottomDrawer'
import { AboutApp } from '@/components/aboutApp'

type Service = {
    id: string
    title: string
    badge?: string // e.g. "ONLY5K", "-75%", "30MINS"
    icon: any
    onPress?: () => void
    isPrimary: boolean
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

function PortalizePortal(props: { children: ReactNode }) {
    return null
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
            isPrimary: true,
            onPress: () => {
                router.push('/service')
            },
        },
        {
            id: 'duration',
            title: 'Durasi',
            badge: 'ONLY6K',
            icon: durationIcon,
            isPrimary: true,
            onPress: () => {
                router.push('/duration')
            },
        },
        {
            id: 'customer',
            title: 'Pelanggan',
            badge: '-75%',
            icon: customerIcon,
            isPrimary: true,
            onPress: () => {
                router.push('/customer ')
            },
        },
        {
            id: 'report',
            title: 'Loporan',
            badge: 'FLAT5K',
            icon: reportIcon,
            isPrimary: true,
            onPress: () => {
                // open()
                setIsReportFilterOpen(true)
                console.log('report')
            },
        },
        {
            id: 'note',
            title: 'Ketentuan',
            badge: '30MINS',
            icon: noteIcon,
            isPrimary: true,
            onPress: () => {
                router.push('/note')
            },
        },
        {
            id: 'more',
            title: 'Lainnya',
            icon: moreIcon,
            isPrimary: true,
            onPress: () => {
                setShowMoreMenu(true)
            },
        },
        {
            id: 'support',
            title: 'Support',
            badge: '30MINS',
            icon: supportIcon,
            isPrimary: false,
            onPress: async () => {
                await Linking.openURL('https://wa.me/6285283811719')
            },
        },
        {
            id: 'faq',
            title: 'FAQ',
            badge: '30MINS',
            icon: faqIcon,
            isPrimary: false,
            onPress: async () => {
                await Linking.openURL('https://cucibayargo.com/#faq')
            },
        },
        {
            id: 'aboutSystem',
            title: 'Tentang Sistem',
            badge: '30MINS',
            icon: aboutIcon,
            isPrimary: false,
            onPress: () => {
                setShowMoreMenu(false)
                setIsAboutAppOpen(true)
            },
        },
    ]
    const [isReportFilterOpen, setIsReportFilterOpen] = useState(false)
    const [reportDate, setReportDate] = useState({
        start: undefined,
        end: undefined,
    })
    registerTranslation('id', id)
    const [showStart, setShowStart] = React.useState(false)
    const [showEnd, setShowEnd] = React.useState(false)
    const locale = getLocales()[0].languageTag ?? 'en-US'
    const fmt = new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
    })
    const [showMoreMenu, setShowMoreMenu] = useState(false)
    const [isAboutAppOpen, setIsAboutAppOpen] = useState(false)

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

    const close = useCallback(() => {
        console.log('close')
        setShowStart(false)
        setShowEnd(false)
        setIsReportFilterOpen(false)
    }, [])

    const onChangeStart = (event: DateTimePickerEvent, date?: Date) => {
        // Android fires 'dismissed' or 'set'. iOS fires 'set' continuously as you scroll.
        const isSet = event.type === 'set' || Platform.OS === 'ios'
        // Close the native dialog after interaction
        if (Platform.OS === 'android') setShowStart(false)

        if (isSet && date) {
            setReportDate((prev) => {
                // If end is before new start, bump end to start (keeps range valid)
                const end = prev.end && prev.end < date ? date : prev.end
                return { start: date, end }
            })
            // Nice UX: auto-open End after choosing Start on Android
            if (Platform.OS === 'android') setShowEnd(true)
        }
    }

    const onChangeEnd = (event: DateTimePickerEvent, date?: Date) => {
        const isSet = event.type === 'set' || Platform.OS === 'ios'
        if (Platform.OS === 'android') setShowEnd(false)

        if (isSet && date) {
            setReportDate((prev) => {
                // If picked end is before start, snap it to start
                const start = prev.start
                const nextEnd = start && date < start ? start : date
                return { start, end: nextEnd }
            })
        }
    }

    const clear = () => setReportDate({})

    const downloadReport = async (): void => {
        const url = `${Constants.expoConfig?.extra?.API_URL}/report/download?start_date=${
            reportDate.start
        }&end_date=${reportDate.end}`
        const supported = await Linking.canOpenURL(url)

        if (supported) {
            // Opening the link with some app, if the URL scheme is "http" the web link should be opened
            // by some browser in the mobile
            await Linking.openURL(url)
        } else {
            Alert.alert(`Don't know how to open this URL: ${url}`)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
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
                        <Avatar.Text
                            size={35}
                            label={user?.name[0]?.toUpperCase() ?? '?'}
                        />
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
                            data={SERVICES.filter((s) => s.isPrimary)}
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

            <Modal
                visible={isReportFilterOpen}
                transparent
                animationType="fade"
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        justifyContent: 'center',
                    }}
                >
                    <View
                        style={{
                            backgroundColor: '#fff',
                            margin: 20,
                            borderRadius: 16,
                            padding: 16,
                        }}
                    >
                        <Text variant="titleMedium" style={{ marginBottom: 8 }}>
                            Pilih Tanggal
                        </Text>

                        <View style={{ gap: 8, marginBottom: 8 }}>
                            <Text>Tanggal Mulai</Text>
                            <Button
                                mode="outlined"
                                onPress={() => setShowStart(true)}
                            >
                                {reportDate.start
                                    ? fmt.format(reportDate.start)
                                    : 'Pilih Tanggal Mulai'}
                            </Button>
                            {showStart && (
                                <DateTimePicker
                                    value={reportDate.start ?? new Date()}
                                    mode="date"
                                    display={
                                        Platform.OS === 'ios'
                                            ? 'inline'
                                            : 'default'
                                    }
                                    // If you already chose an end, don't allow start after end
                                    maximumDate={reportDate.end}
                                    onChange={onChangeStart}
                                />
                            )}
                        </View>
                        <Divider />
                        {/* End field */}
                        <View style={{ gap: 8, marginTop: 8 }}>
                            <Text>Tanggal Selesai</Text>
                            <Button
                                mode="outlined"
                                onPress={() => setShowEnd(true)}
                                disabled={!reportDate.start} // usually you want start first
                            >
                                {reportDate.end
                                    ? fmt.format(reportDate.end)
                                    : 'Pilih Tanggal Selesai'}
                            </Button>
                            {showEnd && (
                                <DateTimePicker
                                    value={
                                        reportDate.end ??
                                        reportDate.start ??
                                        new Date()
                                    }
                                    mode="date"
                                    display={
                                        Platform.OS === 'ios'
                                            ? 'inline'
                                            : 'default'
                                    }
                                    // Can't pick before start
                                    minimumDate={reportDate.start}
                                    onChange={onChangeEnd}
                                />
                            )}
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                gap: 12,
                                marginTop: 16,
                            }}
                        >
                            <Button onPress={close}>Batal</Button>
                            <Button
                                mode="contained"
                                onPress={() => {
                                    close()
                                    downloadReport()
                                }}
                                disabled={!reportDate.start || !reportDate.end}
                            >
                                Download Laporan
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>

            <BottomDrawer
                open={showMoreMenu}
                onClose={() => setShowMoreMenu(false)}
            >
                <View
                    style={{
                        height: 500,
                        // justifyContent: 'center',
                        // margin: 'auto',
                    }}
                >
                    <View>
                        <FlatList
                            data={SERVICES.filter((s) => s.id !== 'more')}
                            keyExtractor={(i) => i.id}
                            numColumns={3}
                            columnWrapperStyle={{
                                gap: 50,
                            }}
                            contentContainerStyle={{
                                justifyContent: 'center',
                                width: '100%',
                            }}
                            renderItem={({ item }) => (
                                <ServiceTile item={item} />
                            )}
                            scrollEnabled={false} // header list shouldn't scroll
                        />
                    </View>
                </View>
            </BottomDrawer>

            <AboutApp
                visible={isAboutAppOpen}
                visibleChange={setIsAboutAppOpen}
            />
        </SafeAreaView>
    )
}

const TILE_SIZE = 80

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // paddingTop: 40,
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
