import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
    Animated,
    BackHandler,
    PanResponder,
    Pressable,
    StyleSheet,
    View,
    LayoutChangeEvent,
} from 'react-native'
import { Portal, Surface, Text } from 'react-native-paper'

type BottomDrawerProps = {
    open: boolean
    onClose: () => void
    children: React.ReactNode
    height?: number // fixed height if you want (otherwise auto)
    dismissable?: boolean // tap backdrop / back button to close
    enableSwipeDown?: boolean
    roundness?: number
    overlayOpacity?: number // 0..1
}

export const BottomDrawer: React.FC<BottomDrawerProps> = ({
    open,
    onClose,
    children,
    height,
    dismissable = true,
    enableSwipeDown = true,
    roundness = 20,
    overlayOpacity = 0.5,
}) => {
    const [visible, setVisible] = useState(open)

    const baseTranslateY = useRef(new Animated.Value(0)).current // show/hide
    const dragY = useRef(new Animated.Value(0)).current // swipe down
    const overlay = useRef(new Animated.Value(0)).current // 0..1
    const measuredHeightRef = useRef<number>(height ?? 300)

    const overlayAnimatedOpacity = overlay.interpolate({
        inputRange: [0, 1],
        outputRange: [0, overlayOpacity],
    })

    const closeAnimated = (callOnClose = true) => {
        Animated.parallel([
            Animated.timing(overlay, {
                toValue: 0,
                duration: 180,
                useNativeDriver: true,
            }),
            Animated.timing(baseTranslateY, {
                toValue: measuredHeightRef.current,
                duration: 220,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setVisible(false)
            dragY.setValue(0)
            if (callOnClose) onClose?.()
        })
    }

    const openAnimated = () => {
        setVisible(true)
        baseTranslateY.setValue(measuredHeightRef.current)
        overlay.setValue(0)
        dragY.setValue(0)
        Animated.parallel([
            Animated.timing(overlay, {
                toValue: 1,
                duration: 180,
                useNativeDriver: true,
            }),
            Animated.spring(baseTranslateY, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 4,
            }),
        ]).start()
    }

    useEffect(() => {
        if (open) openAnimated()
        else if (visible) closeAnimated(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    // Android back button
    useEffect(() => {
        if (!visible || !dismissable) return
        const sub = BackHandler.addEventListener('hardwareBackPress', () => {
            closeAnimated()
            return true
        })
        return () => sub.remove()
    }, [visible, dismissable])

    // Handle swipe down
    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onMoveShouldSetPanResponder: (_e, g) =>
                    enableSwipeDown && (g.dy > 6 || Math.abs(g.vy) > 0.15),
                onPanResponderMove: (_e, g) => {
                    const dy = Math.max(0, g.dy)
                    dragY.setValue(dy)
                },
                onPanResponderRelease: (_e, g) => {
                    const shouldClose = g.dy > 100 || g.vy > 1.3
                    if (shouldClose) closeAnimated()
                    else {
                        Animated.spring(dragY, {
                            toValue: 0,
                            useNativeDriver: true,
                        }).start()
                    }
                },
            }),
        [enableSwipeDown]
    )

    const onContentLayout = (e: LayoutChangeEvent) => {
        if (height) return // user provided a fixed height
        const h = e.nativeEvent.layout.height || 300
        measuredHeightRef.current = h
        // if we just opened and the base translate hasn't been set yet,
        // keep it off-screen until the spring anim kicks in
        if (visible && open) {
            baseTranslateY.setValue(h)
            Animated.spring(baseTranslateY, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 4,
            }).start()
        }
    }

    if (!visible) return null

    return (
        <Portal>
            {/* Backdrop */}
            <Pressable
                onPress={dismissable ? () => closeAnimated() : undefined}
                style={StyleSheet.absoluteFill}
            >
                <Animated.View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: 'black',
                            opacity: overlayAnimatedOpacity,
                        },
                    ]}
                />
            </Pressable>

            {/* Drawer */}
            <Animated.View
                pointerEvents="box-none"
                style={[
                    styles.drawerContainer,
                    {
                        transform: [
                            { translateY: Animated.add(baseTranslateY, dragY) },
                        ],
                    },
                ]}
            >
                <Surface
                    style={[
                        styles.sheet,
                        {
                            borderTopLeftRadius: roundness,
                            borderTopRightRadius: roundness,
                            maxHeight: '85%',
                            height: height, // may be undefined => auto
                        },
                    ]}
                    {...panResponder.panHandlers}
                    onLayout={onContentLayout}
                    elevation={3}
                >
                    {/* Drag handle */}
                    <View
                        style={styles.handleWrap}
                        {...panResponder.panHandlers}
                    >
                        <View style={styles.handle} />
                        <Text
                            variant="labelSmall"
                            style={{ opacity: 0.6, marginTop: 2 }}
                        >
                            Pull down to close
                        </Text>
                    </View>

                    <View style={styles.content}>{children}</View>
                </Surface>
            </Animated.View>
        </Portal>
    )
}

const styles = StyleSheet.create({
    drawerContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -90,
    },
    sheet: {
        backgroundColor: 'white',
        paddingBottom: 16,
    },
    handleWrap: {
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 6,
    },
    handle: {
        width: 44,
        height: 5,
        borderRadius: 999,
        backgroundColor: '#D1D5DB',
    },
    content: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
})
