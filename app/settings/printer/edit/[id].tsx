import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    TextInput,
    StyleSheet,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import {
    PrinterIcon,
    ArrowLeftIcon,
    SettingsIcon,
    SaveIcon,
    TestTubeIcon,
} from 'lucide-react-native'
import { usePrinterConfig } from '../../../../hooks/printer/usePrinterConfig'
import { PrinterSettings } from '../../../../types/printer'
import {
    PrinterCommandBuilder,
    stringToBytes,
} from '../../../../utils/printerCommands'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    content: {
        padding: 16,
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
    errorContainer: {
        flex: 1,
        backgroundColor: '#f9fafb',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
    },
    errorText: {
        color: '#6b7280',
        marginTop: 8,
        textAlign: 'center',
    },
    errorButton: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    errorButtonText: {
        color: 'white',
        fontWeight: '600',
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
    infoCard: {
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
    infoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
        color: '#111827',
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
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
    infoText: {
        color: '#6b7280',
    },
    infoTextSmall: {
        color: '#6b7280',
        fontSize: 12,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginRight: 8,
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    statusDotConnected: {
        backgroundColor: '#10b981',
    },
    statusDotDisconnected: {
        backgroundColor: '#9ca3af',
    },
    statusText: {
        fontSize: 14,
        color: '#6b7280',
    },
    testButton: {
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    testButtonEnabled: {
        backgroundColor: '#8b5cf6',
    },
    testButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
    testButtonText: {
        color: 'white',
        fontWeight: '600',
        marginLeft: 8,
    },
    settingsCard: {
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
    settingsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    settingsTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
        color: '#111827',
    },
    settingGroup: {
        marginBottom: 16,
    },
    settingLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    settingLabelWithValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 8,
    },
    optionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
    },
    optionButtonSelected: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    optionButtonUnselected: {
        backgroundColor: 'white',
        borderColor: '#d1d5db',
    },
    optionButtonText: {
        fontWeight: '500',
    },
    optionButtonTextSelected: {
        color: 'white',
    },
    optionButtonTextUnselected: {
        color: '#374151',
    },
    sliderContainer: {
        flexDirection: 'row',
        gap: 4,
    },
    sliderDot: {
        width: 24,
        height: 24,
        borderRadius: 4,
    },
    sliderDotSelected: {
        backgroundColor: '#3b82f6',
    },
    sliderDotUnselected: {
        backgroundColor: '#e5e7eb',
    },
    sliderDotSelectedGreen: {
        backgroundColor: '#10b981',
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    toggle: {
        width: 48,
        height: 24,
        borderRadius: 12,
    },
    toggleEnabled: {
        backgroundColor: '#3b82f6',
    },
    toggleDisabled: {
        backgroundColor: '#d1d5db',
    },
    toggleThumb: {
        width: 20,
        height: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        position: 'absolute',
        top: 2,
    },
    toggleThumbEnabled: {
        right: 2,
    },
    toggleThumbDisabled: {
        left: 2,
    },
    saveButton: {
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonEnabled: {
        backgroundColor: '#10b981',
    },
    saveButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '600',
        marginLeft: 8,
    },
    helpCard: {
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        padding: 16,
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
    helpTextLast: {
        color: '#374151',
        fontSize: 14,
        marginBottom: 0,
    },
})

export default function EditPrinter() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const { savedPrinters, updatePrinter, updatePrinterSettings, isLoading } =
        usePrinterConfig()

    const [printerName, setPrinterName] = useState('')
    const [settings, setSettings] = useState<PrinterSettings>({
        paperSize: '58mm',
        printDensity: 8,
        printSpeed: 8,
        autoCut: true,
    })
    const [isSaving, setIsSaving] = useState(false)
    const [isPrinting, setIsPrinting] = useState(false)

    const printer = savedPrinters.printers.find((p) => p.id === id)

    useEffect(() => {
        if (printer) {
            setPrinterName(printer.name)
            setSettings(printer.settings)
        }
    }, [printer])

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Loading printer...</Text>
            </View>
        )
    }

    if (!printer) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>Printer Not Found</Text>
                <Text style={styles.errorText}>
                    The printer you're looking for doesn't exist.
                </Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.errorButton}
                >
                    <Text style={styles.errorButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        )
    }

    const handleSaveSettings = async () => {
        setIsSaving(true)
        try {
            const success = await updatePrinter(printer.id, {
                name: printerName.trim(),
                settings,
            })

            if (success) {
                Alert.alert('Success', 'Printer settings updated successfully')
            } else {
                Alert.alert('Error', 'Failed to update printer settings')
            }
        } catch (error) {
            console.error('Save error:', error)
            Alert.alert('Error', 'Failed to save printer settings')
        } finally {
            setIsSaving(false)
        }
    }

    const handleTestPrint = async () => {
        if (!printer.isConnected) {
            Alert.alert('Not Connected', 'Please connect to the printer first')
            return
        }

        setIsPrinting(true)
        try {
            // Create test print command
            const testPrintCommand = PrinterCommandBuilder.createTestPrint()
            const printData = stringToBytes(testPrintCommand)

            console.log('Sending print command:', printData)

            // Simulate print delay
            await new Promise((resolve) => setTimeout(resolve, 2000))

            Alert.alert(
                'Print Sent',
                'Test print command has been sent to the printer'
            )
        } catch (error) {
            console.error('Print error:', error)
            Alert.alert('Print Failed', 'Failed to send print command')
        } finally {
            setIsPrinting(false)
        }
    }

    const updateSetting = (key: keyof PrinterSettings, value: any) => {
        setSettings((prev) => ({ ...prev, [key]: value }))
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
                            <ArrowLeftIcon size={20} color="#3B82F6" />
                        </TouchableOpacity>
                        <View style={styles.headerTitle}>
                            <SettingsIcon
                                size={24}
                                color="#3B82F6"
                                style={styles.headerIcon}
                            />
                            <Text style={styles.headerTitleText}>
                                Edit Printer
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Printer Info */}
                <View style={styles.infoCard}>
                    <View style={styles.infoHeader}>
                        <PrinterIcon size={20} color="#6B7280" />
                        <Text style={styles.infoTitle}>
                            Printer Information
                        </Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Printer Name</Text>
                        <TextInput
                            value={printerName}
                            onChangeText={setPrinterName}
                            style={styles.nameInput}
                            maxLength={50}
                        />
                    </View>

                    <View style={{ marginBottom: 8 }}>
                        <Text style={styles.inputLabel}>Device Name</Text>
                        <Text style={styles.infoText}>
                            {printer.deviceName}
                        </Text>
                    </View>

                    <View style={{ marginBottom: 8 }}>
                        <Text style={styles.inputLabel}>Device ID</Text>
                        <Text style={styles.infoTextSmall}>{printer.id}</Text>
                    </View>

                    <View style={styles.statusRow}>
                        <Text style={styles.statusLabel}>Status:</Text>
                        <View
                            style={[
                                styles.statusDot,
                                printer.isConnected
                                    ? styles.statusDotConnected
                                    : styles.statusDotDisconnected,
                            ]}
                        />
                        <Text style={styles.statusText}>
                            {printer.isConnected ? 'Connected' : 'Disconnected'}
                        </Text>
                    </View>
                </View>

                {/* Test Print Button */}
                {printer.isConnected && (
                    <TouchableOpacity
                        onPress={handleTestPrint}
                        disabled={isPrinting}
                        className={`rounded-lg p-4 mb-4 flex-row items-center justify-center ${
                            isPrinting ? 'bg-gray-400' : 'bg-purple-500'
                        }`}
                    >
                        {isPrinting ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <TestTubeIcon size={20} color="white" />
                        )}
                        <Text className="text-white font-semibold ml-2">
                            {isPrinting ? 'Printing...' : 'Test Print'}
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Printer Settings */}
                <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
                    <View className="flex-row items-center mb-4">
                        <SettingsIcon size={20} color="#6B7280" />
                        <Text className="text-lg font-semibold ml-2 text-gray-900">
                            Printer Settings
                        </Text>
                    </View>

                    {/* Paper Size */}
                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700 mb-2">
                            Paper Size
                        </Text>
                        <View className="flex-row space-x-2">
                            {(['58mm', '80mm'] as const).map((size) => (
                                <TouchableOpacity
                                    key={size}
                                    onPress={() =>
                                        updateSetting('paperSize', size)
                                    }
                                    className={`px-4 py-2 rounded-lg border ${
                                        settings.paperSize === size
                                            ? 'bg-blue-500 border-blue-500'
                                            : 'bg-white border-gray-300'
                                    }`}
                                >
                                    <Text
                                        className={`font-medium ${
                                            settings.paperSize === size
                                                ? 'text-white'
                                                : 'text-gray-700'
                                        }`}
                                    >
                                        {size}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Print Density */}
                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700 mb-2">
                            Print Density: {settings.printDensity}
                        </Text>
                        <View className="flex-row space-x-1">
                            {Array.from({ length: 15 }, (_, i) => i + 1).map(
                                (value) => (
                                    <TouchableOpacity
                                        key={value}
                                        onPress={() =>
                                            updateSetting('printDensity', value)
                                        }
                                        className={`w-6 h-6 rounded ${
                                            settings.printDensity === value
                                                ? 'bg-blue-500'
                                                : 'bg-gray-200'
                                        }`}
                                    />
                                )
                            )}
                        </View>
                    </View>

                    {/* Print Speed */}
                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700 mb-2">
                            Print Speed: {settings.printSpeed}
                        </Text>
                        <View className="flex-row space-x-1">
                            {Array.from({ length: 15 }, (_, i) => i + 1).map(
                                (value) => (
                                    <TouchableOpacity
                                        key={value}
                                        onPress={() =>
                                            updateSetting('printSpeed', value)
                                        }
                                        className={`w-6 h-6 rounded ${
                                            settings.printSpeed === value
                                                ? 'bg-green-500'
                                                : 'bg-gray-200'
                                        }`}
                                    />
                                )
                            )}
                        </View>
                    </View>

                    {/* Auto Cut */}
                    <View className="flex-row items-center justify-between">
                        <Text className="text-sm font-medium text-gray-700">
                            Auto Cut
                        </Text>
                        <TouchableOpacity
                            onPress={() =>
                                updateSetting('autoCut', !settings.autoCut)
                            }
                            className={`w-12 h-6 rounded-full ${
                                settings.autoCut ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                        >
                            <View
                                className={`w-5 h-5 bg-white rounded-full absolute top-0.5 ${
                                    settings.autoCut ? 'right-0.5' : 'left-0.5'
                                }`}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    onPress={handleSaveSettings}
                    disabled={isSaving || !printerName.trim()}
                    className={`rounded-lg p-4 mb-4 flex-row items-center justify-center ${
                        isSaving || !printerName.trim()
                            ? 'bg-gray-400'
                            : 'bg-green-500'
                    }`}
                >
                    {isSaving ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <SaveIcon size={20} color="white" />
                    )}
                    <Text className="text-white font-semibold ml-2">
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </Text>
                </TouchableOpacity>

                {/* Help Text */}
                <View className="bg-gray-50 rounded-lg p-4">
                    <Text className="text-gray-800 font-semibold mb-2">
                        Settings Help:
                    </Text>
                    <Text className="text-gray-700 text-sm mb-1">
                        • Paper Size: Choose the width of your thermal paper
                    </Text>
                    <Text className="text-gray-700 text-sm mb-1">
                        • Print Density: Higher values make text darker
                    </Text>
                    <Text className="text-gray-700 text-sm mb-1">
                        • Print Speed: Higher values print faster
                    </Text>
                    <Text className="text-gray-700 text-sm">
                        • Auto Cut: Automatically cut paper after printing
                    </Text>
                </View>
            </View>
        </ScrollView>
    )
}
