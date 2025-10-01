import React, { useEffect, useRef } from 'react'
import { Animated, View } from 'react-native'

const SkeletonBlock = ({
    height,
    width,
    style,
}: {
    height: number
    width: number | string
    style?: object
}) => {
    const opacity = useRef(new Animated.Value(0.4)).current

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.4,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        )
        loop.start()
        return () => loop.stop()
    }, [opacity])

    return (
        <Animated.View
            style={[
                {
                    height,
                    width,
                    backgroundColor: '#E5E7EB',
                    borderRadius: 8,
                    opacity,
                },
                style,
            ]}
        />
    )
}

const OrderCardSkeleton = () => {
    return (
        <View
            style={{
                backgroundColor: 'white',
                paddingHorizontal: 16,
                paddingVertical: 14,
            }}
        >
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 16,
                }}
            >
                <SkeletonBlock height={20} width={180} />
            </View>

            <SkeletonBlock
                height={14}
                width={140}
                style={{ marginBottom: 8 }}
            />

            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 20,
                    marginBottom: 14,
                }}
            >
                <SkeletonBlock height={12} width={160} />
                <SkeletonBlock height={12} width={120} />
            </View>

            <View
                style={{ height: 1, backgroundColor: '#E5E7EB', marginTop: 10 }}
            />
        </View>
    )
}

export default OrderCardSkeleton
