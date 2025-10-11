import React, { useState } from 'react'
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet,
} from 'react-native'
import { router } from 'expo-router'
import {
    PrinterIcon,
    PlusIcon,
    SettingsIcon,
    TestTubeIcon,
    TrashIcon,
    StarIcon,
} from 'lucide-react-native'
import { usePrinterConfig } from '../../../hooks/printer/usePrinterConfig'
import { PrinterConfig } from '../../../types/printer'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#f9fafb',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: '#6b7280',
        marginTop: 16,
    },
    content: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
        padding: 8,
        marginLeft: -8,
    },
    backText: {
        color: '#3b82f6',
        fontSize: 18,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIcon: {
        marginLeft: 8,
    },
    headerTitleText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 8,
        color: '#111827',
    },
    addButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontWeight: '500',
        marginLeft: 8,
    },
    activePrinterCard: {
        backgroundColor: '#dbeafe',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#93c5fd',
    },
    activePrinterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    activePrinterTitle: {
        color: '#1e40af',
        fontWeight: '600',
        marginLeft: 8,
    },
    activePrinterDevice: {
        color: '#1d4ed8',
        fontSize: 14,
        marginTop: 4,
    },
    activePrinterStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    statusDotConnected: {
        backgroundColor: '#10b981',
    },
    statusDotDisconnected: {
        backgroundColor: '#9ca3af',
    },
    activePrinterStatusText: {
        color: '#1d4ed8',
        fontSize: 14,
    },
    emptyStateCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    emptyStateContent: {
        alignItems: 'center',
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
        marginTop: 16,
    },
    emptyStateText: {
        color: '#6b7280',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    emptyStateButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    emptyStateButtonText: {
        color: 'white',
        fontWeight: '600',
        marginLeft: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    printerCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        borderWidth: 1,
    },
    printerCardActive: {
        borderColor: '#3b82f6',
    },
    printerCardInactive: {
        borderColor: '#e5e7eb',
    },
    printerHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    printerInfo: {
        flex: 1,
    },
    printerNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    printerName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    activeIcon: {
        marginLeft: 8,
    },
    printerDevice: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 4,
    },
    printerId: {
        fontSize: 12,
        color: '#9ca3af',
    },
    printerLastConnected: {
        fontSize: 12,
        color: '#9ca3af',
    },
    printerStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    printerStatusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    printerStatusDotConnected: {
        backgroundColor: '#10b981',
    },
    printerStatusDotDisconnected: {
        backgroundColor: '#9ca3af',
    },
    printerStatusText: {
        fontSize: 12,
        color: '#6b7280',
    },
    printerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    actionButtonsLeft: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButtonsRight: {
        flexDirection: 'row',
        gap: 8,
    },
    connectButton: {
        backgroundColor: '#10b981',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    disconnectButton: {
        backgroundColor: '#ef4444',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    testButton: {
        backgroundColor: '#8b5cf6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    settingsButton: {
        backgroundColor: '#6b7280',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    deleteButton: {
        backgroundColor: '#dc2626',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    setActiveButton: {
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        padding: 8,
        marginTop: 12,
    },
    setActiveButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    helpCard: {
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        padding: 16,
        marginTop: 24,
    },
    helpTitle: {
        color: '#1f2937',
        fontWeight: '600',
        marginBottom: 8,
    },
    helpText: {
        color: '#374151',
        fontSize: 14,
        marginBottom: 4,
    },
})

export default function PrinterList() {
    const {
        savedPrinters,
        activePrinter,
        isLoading,
        setActivePrinter,
        deletePrinter,
        updateConnectionStatus,
    } = usePrinterConfig()

    const [connectingPrinter, setConnectingPrinter] = useState<string | null>(
        null
    )
    const [deletingPrinter, setDeletingPrinter] = useState<string | null>(null)

    const handleSetActive = async (printerId: string) => {
        const success = await setActivePrinter(printerId)
        if (success) {
            Alert.alert('Success', 'Printer set as active successfully')
        } else {
            Alert.alert('Error', 'Failed to set printer as active')
        }
    }

    const handleDelete = async (printer: PrinterConfig) => {
        Alert.alert(
            'Delete Printer',
            `Are you sure you want to delete "${printer.name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setDeletingPrinter(printer.id)
                        const success = await deletePrinter(printer.id)
                        setDeletingPrinter(null)

                        if (success) {
                            Alert.alert(
                                'Success',
                                'Printer deleted successfully'
                            )
                        } else {
                            Alert.alert('Error', 'Failed to delete printer')
                        }
                    },
                },
            ]
        )
    }

    const handleConnect = async (printer: PrinterConfig) => {
        setConnectingPrinter(printer.id)
        try {
            // Simulate connection process
            await new Promise((resolve) => setTimeout(resolve, 2000))

            const success = await updateConnectionStatus(printer.id, true)
            if (success) {
                Alert.alert(
                    'Connected',
                    `Successfully connected to ${printer.name}`
                )
            } else {
                Alert.alert('Error', 'Failed to update connection status')
            }
        } catch (error) {
            Alert.alert('Connection Failed', 'Failed to connect to printer')
        } finally {
            setConnectingPrinter(null)
        }
    }

    const handleDisconnect = async (printer: PrinterConfig) => {
        const success = await updateConnectionStatus(printer.id, false)
        if (success) {
            Alert.alert('Disconnected', `Disconnected from ${printer.name}`)
        } else {
            Alert.alert('Error', 'Failed to disconnect from printer')
        }
    }

    const handleTestPrint = (printer: PrinterConfig) => {
        Alert.alert('Test Print', `Send test print to ${printer.name}?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Print',
                onPress: () => {
                    Alert.alert(
                        'Print Sent',
                        'Test print command sent to printer'
                    )
                },
            },
        ])
    }

    const renderPrinterItem = (printer: PrinterConfig) => (
        <View
            key={printer.id}
            style={[
                styles.printerCard,
                printer.isActive
                    ? styles.printerCardActive
                    : styles.printerCardInactive,
            ]}
        >
            <View style={styles.printerHeader}>
                <View style={styles.printerInfo}>
                    <View style={styles.printerNameRow}>
                        <Text style={styles.printerName}>{printer.name}</Text>
                        {printer.isActive && (
                            <StarIcon
                                size={16}
                                color="#F59E0B"
                                style={styles.activeIcon}
                            />
                        )}
                    </View>
                    <Text style={styles.printerDevice}>
                        Device: {printer.deviceName}
                    </Text>
                    <Text style={styles.printerId}>ID: {printer.id}</Text>
                    {printer.lastConnected && (
                        <Text style={styles.printerLastConnected}>
                            Last connected:{' '}
                            {new Date(
                                printer.lastConnected
                            ).toLocaleDateString()}
                        </Text>
                    )}
                </View>
                <View style={styles.printerStatus}>
                    <View
                        style={[
                            styles.printerStatusDot,
                            printer.isConnected
                                ? styles.printerStatusDotConnected
                                : styles.printerStatusDotDisconnected,
                        ]}
                    />
                    <Text style={styles.printerStatusText}>
                        {printer.isConnected ? 'Connected' : 'Disconnected'}
                    </Text>
                </View>
            </View>

            {/* Connection Status and Actions */}
            <View style={styles.printerActions}>
                <View style={styles.actionButtonsLeft}>
                    {printer.isConnected ? (
                        <TouchableOpacity
                            onPress={() => handleDisconnect(printer)}
                            style={styles.disconnectButton}
                        >
                            <Text style={styles.buttonText}>Disconnect</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() => handleConnect(printer)}
                            disabled={connectingPrinter === printer.id}
                            style={styles.connectButton}
                        >
                            {connectingPrinter === printer.id ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Text style={styles.buttonText}>Connect</Text>
                            )}
                        </TouchableOpacity>
                    )}

                    {printer.isConnected && (
                        <TouchableOpacity
                            onPress={() => handleTestPrint(printer)}
                            style={styles.testButton}
                        >
                            <TestTubeIcon size={14} color="white" />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.actionButtonsRight}>
                    <TouchableOpacity
                        onPress={() =>
                            router.push(`/settings/printer/edit/${printer.id}`)
                        }
                        style={styles.settingsButton}
                    >
                        <SettingsIcon size={14} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => handleDelete(printer)}
                        disabled={deletingPrinter === printer.id}
                        style={styles.deleteButton}
                    >
                        {deletingPrinter === printer.id ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <TrashIcon size={14} color="white" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Set as Active Button */}
            {!printer.isActive && (
                <TouchableOpacity
                    onPress={() => handleSetActive(printer.id)}
                    style={styles.setActiveButton}
                >
                    <Text style={styles.setActiveButtonText}>
                        Set as Active Printer
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    )

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Loading printers...</Text>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <Text style={styles.backText}>← Back</Text>
                        </TouchableOpacity>
                        <View style={styles.headerTitle}>
                            <PrinterIcon
                                size={24}
                                color="#3B82F6"
                                style={styles.headerIcon}
                            />
                            <Text style={styles.headerTitleText}>
                                Printer Configuration
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/settings/printer/add')}
                        style={styles.addButton}
                    >
                        <PlusIcon size={16} color="white" />
                        <Text style={styles.addButtonText}>Add Printer</Text>
                    </TouchableOpacity>
                </View>

                {/* Active Printer Info */}
                {activePrinter && (
                    <View style={styles.activePrinterCard}>
                        <View style={styles.activePrinterHeader}>
                            <StarIcon size={20} color="#F59E0B" />
                            <Text style={styles.activePrinterTitle}>
                                Active Printer: {activePrinter.name}
                            </Text>
                        </View>
                        <Text style={styles.activePrinterDevice}>
                            Device: {activePrinter.deviceName}
                        </Text>
                        <View style={styles.activePrinterStatus}>
                            <View
                                style={[
                                    styles.statusDot,
                                    activePrinter.isConnected
                                        ? styles.statusDotConnected
                                        : styles.statusDotDisconnected,
                                ]}
                            />
                            <Text style={styles.activePrinterStatusText}>
                                {activePrinter.isConnected
                                    ? 'Connected'
                                    : 'Disconnected'}
                            </Text>
                        </View>
                    </View>
                )}

                {/* Saved Printers List */}
                {savedPrinters.printers.length === 0 ? (
                    <View style={styles.emptyStateCard}>
                        <View style={styles.emptyStateContent}>
                            <PrinterIcon size={48} color="#9CA3AF" />
                            <Text style={styles.emptyStateTitle}>
                                No Printers Added
                            </Text>
                            <Text style={styles.emptyStateText}>
                                Add your first Bluetooth printer to get started
                                with printing receipts and labels.
                            </Text>
                            <TouchableOpacity
                                onPress={() =>
                                    router.push('/settings/printer/add')
                                }
                                style={styles.emptyStateButton}
                            >
                                <PlusIcon size={20} color="white" />
                                <Text style={styles.emptyStateButtonText}>
                                    Add Your First Printer
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 16,
                            }}
                        >
                            <Text style={styles.sectionTitle}>
                                Saved Printers ({savedPrinters.printers.length})
                            </Text>
                        </View>
                        {savedPrinters.printers.map(renderPrinterItem)}
                    </View>
                )}

                {/* Instructions */}
                <View style={styles.helpCard}>
                    <Text style={styles.helpTitle}>Quick Actions:</Text>
                    <Text style={styles.helpText}>
                        • Tap "Add Printer" to scan and add new printers
                    </Text>
                    <Text style={styles.helpText}>
                        • Set one printer as active for default printing
                    </Text>
                    <Text style={styles.helpText}>
                        • Use settings icon to configure printer options
                    </Text>
                    <Text style={[styles.helpText, { marginBottom: 0 }]}>
                        • Test print to verify printer connection
                    </Text>
                </View>
            </View>
        </ScrollView>
    )
}
