import React, { useState } from 'react'
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    TextInput,
    RefreshControl,
    StyleSheet,
} from 'react-native'
import { router } from 'expo-router'
import { Device } from 'react-native-ble-plx'
import {
    PrinterIcon,
    WifiIcon,
    ArrowLeftIcon,
    CheckIcon,
} from 'lucide-react-native'
import useBLE from '../../../hooks/bluetooth/useBLE'
import { usePrinterConfig } from '../../../hooks/printer/usePrinterConfig'
import { PrinterConfig } from '../../../types/printer'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
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
    selectedDeviceCard: {
        backgroundColor: '#dcfce7',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    selectedDeviceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    selectedDeviceTitle: {
        color: '#059669',
        fontWeight: '600',
        marginLeft: 8,
    },
    selectedDeviceText: {
        color: '#047857',
        fontSize: 14,
    },
    selectedDeviceId: {
        color: '#065f46',
        fontSize: 12,
        marginTop: 4,
    },
    nameInputCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    nameInputTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
    },
    nameInput: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#111827',
    },
    nameInputHelp: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 8,
    },
    addButton: {
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonEnabled: {
        backgroundColor: '#10b981',
    },
    addButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
    addButtonText: {
        color: 'white',
        fontWeight: '600',
        marginLeft: 8,
    },
    scanCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    scanHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    scanTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scanTitleText: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
        color: '#111827',
    },
    scanButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    scanButtonActive: {
        backgroundColor: '#ef4444',
    },
    scanButtonInactive: {
        backgroundColor: '#3b82f6',
    },
    scanButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scanButtonText: {
        color: 'white',
        fontWeight: '500',
        marginLeft: 8,
    },
    scanningInfo: {
        backgroundColor: '#dbeafe',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    scanningText: {
        color: '#1d4ed8',
        fontSize: 14,
        textAlign: 'center',
    },
    noDevicesCard: {
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        padding: 16,
    },
    noDevicesText: {
        color: '#6b7280',
        textAlign: 'center',
    },
    devicesList: {
        marginTop: 12,
    },
    devicesFoundText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 12,
    },
    deviceItem: {
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        borderWidth: 1,
    },
    deviceItemSelected: {
        backgroundColor: '#dbeafe',
        borderColor: '#3b82f6',
    },
    deviceItemUnselected: {
        backgroundColor: 'white',
        borderColor: '#e5e7eb',
    },
    deviceItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    deviceInfo: {
        flex: 1,
    },
    deviceName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    deviceId: {
        fontSize: 14,
        color: '#6b7280',
    },
    deviceRssi: {
        fontSize: 12,
        color: '#9ca3af',
    },
    checkIcon: {
        marginLeft: 8,
    },
    instructionsCard: {
        backgroundColor: '#dbeafe',
        borderRadius: 8,
        padding: 16,
    },
    instructionsTitle: {
        color: '#1e40af',
        fontWeight: '600',
        marginBottom: 8,
    },
    instructionText: {
        color: '#1d4ed8',
        fontSize: 14,
        marginBottom: 4,
    },
    instructionTextLast: {
        color: '#1d4ed8',
        fontSize: 14,
        marginBottom: 0,
    },
})

export default function AddPrinter() {
    const {
        requestPermissions,
        scanForPeripherals,
        stopScan,
        connectToDevice,
        disconnectFromDevice,
        allDevices,
        connectedDevice,
        isScanning,
    } = useBLE()

    const { addPrinter, setActivePrinter } = usePrinterConfig()

    const [isConnecting, setIsConnecting] = useState(false)
    const [customName, setCustomName] = useState('')
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
    const [isAdding, setIsAdding] = useState(false)

    const handleStartScan = async () => {
        try {
            const hasPermission = await requestPermissions()
            if (!hasPermission) {
                Alert.alert(
                    'Permission Required',
                    'Bluetooth permissions are required to scan for devices'
                )
                return
            }
            scanForPeripherals()
        } catch (error) {
            console.error('Scan error:', error)
            Alert.alert('Scan Failed', 'Failed to start scanning for devices')
        }
    }

    const handleSelectDevice = (device: Device) => {
        setSelectedDevice(device)
        setCustomName(device.name || device.localName || 'My Printer')
        if (isScanning) {
            stopScan()
        }
    }

    const handleConnectAndAdd = async () => {
        if (!selectedDevice) {
            Alert.alert(
                'No Device Selected',
                'Please select a printer device first'
            )
            return
        }

        if (!customName.trim()) {
            Alert.alert(
                'Invalid Name',
                'Please enter a custom name for your printer'
            )
            return
        }

        setIsAdding(true)
        try {
            // Request permissions first
            const hasPermission = await requestPermissions()
            if (!hasPermission) {
                Alert.alert(
                    'Permission Required',
                    'Bluetooth permissions are required to connect to printer'
                )
                return
            }

            // Connect to device
            await connectToDevice(selectedDevice)

            // Create printer configuration
            const printerConfig: PrinterConfig = {
                id: selectedDevice.id,
                name: customName.trim(),
                deviceName:
                    selectedDevice.name ||
                    selectedDevice.localName ||
                    'Unknown Device',
                macAddress: selectedDevice.id,
                isConnected: true,
                lastConnected: new Date(),
                isActive: false,
                settings: {
                    paperSize: '58mm',
                    printDensity: 8,
                    printSpeed: 8,
                    autoCut: true,
                },
            }

            // Add printer to saved list
            const success = await addPrinter(printerConfig)
            if (success) {
                Alert.alert(
                    'Printer Added Successfully',
                    `${customName} has been added to your printer list. Would you like to set it as the active printer?`,
                    [
                        {
                            text: 'Later',
                            style: 'cancel',
                            onPress: () => router.back(),
                        },
                        {
                            text: 'Set as Active',
                            onPress: async () => {
                                await setActivePrinter(selectedDevice.id)
                                router.back()
                            },
                        },
                    ]
                )
            } else {
                Alert.alert('Error', 'Failed to save printer configuration')
            }
        } catch (error) {
            console.error('Connection error:', error)
            Alert.alert(
                'Connection Failed',
                'Failed to connect to the printer. Please try again.'
            )
        } finally {
            setIsAdding(false)
        }
    }

    const renderDeviceItem = (device: Device) => (
        <TouchableOpacity
            key={device.id}
            onPress={() => handleSelectDevice(device)}
            style={[
                styles.deviceItem,
                selectedDevice?.id === device.id
                    ? styles.deviceItemSelected
                    : styles.deviceItemUnselected,
            ]}
        >
            <View style={styles.deviceItemContent}>
                <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>
                        {device.name || device.localName || 'Unknown Device'}
                    </Text>
                    <Text style={styles.deviceId}>ID: {device.id}</Text>
                    {device.rssi && (
                        <Text style={styles.deviceRssi}>
                            Signal: {device.rssi} dBm
                        </Text>
                    )}
                </View>
                {selectedDevice?.id === device.id && (
                    <CheckIcon
                        size={20}
                        color="#3B82F6"
                        style={styles.checkIcon}
                    />
                )}
            </View>
        </TouchableOpacity>
    )

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={isScanning}
                    onRefresh={handleStartScan}
                    tintColor="#3B82F6"
                />
            }
        >
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <ArrowLeftIcon size={20} color="#3B82F6" />
                        </TouchableOpacity>
                        <View style={styles.headerTitle}>
                            <PrinterIcon
                                size={24}
                                color="#3B82F6"
                                style={styles.headerIcon}
                            />
                            <Text style={styles.headerTitleText}>
                                Add New Printer
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Selected Device Info */}
                {selectedDevice && (
                    <View style={styles.selectedDeviceCard}>
                        <View style={styles.selectedDeviceHeader}>
                            <CheckIcon size={20} color="#059669" />
                            <Text style={styles.selectedDeviceTitle}>
                                Device Selected
                            </Text>
                        </View>
                        <Text style={styles.selectedDeviceText}>
                            {selectedDevice.name ||
                                selectedDevice.localName ||
                                'Unknown Device'}
                        </Text>
                        <Text style={styles.selectedDeviceId}>
                            ID: {selectedDevice.id}
                        </Text>
                    </View>
                )}

                {/* Custom Name Input */}
                {selectedDevice && (
                    <View style={styles.nameInputCard}>
                        <Text style={styles.nameInputTitle}>
                            Custom Printer Name
                        </Text>
                        <TextInput
                            value={customName}
                            onChangeText={setCustomName}
                            placeholder="Enter a custom name for your printer"
                            style={styles.nameInput}
                            maxLength={50}
                        />
                        <Text style={styles.nameInputHelp}>
                            This name will be displayed in your printer list
                        </Text>
                    </View>
                )}

                {/* Add Button */}
                {selectedDevice && customName.trim() && (
                    <TouchableOpacity
                        onPress={handleConnectAndAdd}
                        disabled={isAdding}
                        style={[
                            styles.addButton,
                            isAdding
                                ? styles.addButtonDisabled
                                : styles.addButtonEnabled,
                        ]}
                    >
                        {isAdding ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <CheckIcon size={20} color="white" />
                        )}
                        <Text style={styles.addButtonText}>
                            {isAdding ? 'Adding Printer...' : 'Add Printer'}
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Scan Section */}
                <View style={styles.scanCard}>
                    <View style={styles.scanHeader}>
                        <View style={styles.scanTitle}>
                            <WifiIcon size={20} color="#6B7280" />
                            <Text style={styles.scanTitleText}>
                                Scan for Printers
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={isScanning ? stopScan : handleStartScan}
                            style={[
                                styles.scanButton,
                                isScanning
                                    ? styles.scanButtonActive
                                    : styles.scanButtonInactive,
                            ]}
                        >
                            {isScanning ? (
                                <View style={styles.scanButtonContent}>
                                    <ActivityIndicator
                                        color="white"
                                        size="small"
                                    />
                                    <Text style={styles.scanButtonText}>
                                        Stop
                                    </Text>
                                </View>
                            ) : (
                                <Text style={styles.scanButtonText}>Scan</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {isScanning && (
                        <View style={styles.scanningInfo}>
                            <Text style={styles.scanningText}>
                                Scanning for Bluetooth devices... Make sure your
                                printer is turned on and in pairing mode.
                            </Text>
                        </View>
                    )}

                    {allDevices.length === 0 && !isScanning && (
                        <View style={styles.noDevicesCard}>
                            <Text style={styles.noDevicesText}>
                                No devices found. Tap "Scan" to search for
                                Bluetooth printers.
                            </Text>
                        </View>
                    )}

                    {allDevices.length > 0 && (
                        <View style={styles.devicesList}>
                            <Text style={styles.devicesFoundText}>
                                Found {allDevices.length} device(s):
                            </Text>
                            {allDevices.map(renderDeviceItem)}
                        </View>
                    )}
                </View>

                {/* Instructions */}
                <View style={styles.instructionsCard}>
                    <Text style={styles.instructionsTitle}>
                        Setup Instructions:
                    </Text>
                    <Text style={styles.instructionText}>
                        1. Turn on your Bluetooth printer
                    </Text>
                    <Text style={styles.instructionText}>
                        2. Put the printer in pairing mode
                    </Text>
                    <Text style={styles.instructionText}>
                        3. Tap "Scan" to find available devices
                    </Text>
                    <Text style={styles.instructionText}>
                        4. Select your printer from the list
                    </Text>
                    <Text style={styles.instructionText}>
                        5. Enter a custom name for easy identification
                    </Text>
                    <Text style={styles.instructionTextLast}>
                        6. Tap "Add Printer" to save the configuration
                    </Text>
                </View>
            </View>
        </ScrollView>
    )
}
