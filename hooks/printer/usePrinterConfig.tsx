import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
    PrinterConfig,
    PrinterSettings,
    SavedPrinters,
} from '../../types/printer'
import printerAPIService from '../../services/printer-api.service'
import { PrinterAPI } from '../../types/printer-api'

const PRINTER_CONFIG_KEY = 'saved_printers'

export const usePrinterConfig = () => {
    const [savedPrinters, setSavedPrinters] = useState<SavedPrinters>({
        printers: [],
        activePrinterId: undefined,
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isSyncing, setIsSyncing] = useState(false)
    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)

    useEffect(() => {
        loadPrinterConfig()
    }, [])

    const loadPrinterConfig = async () => {
        try {
            setIsLoading(true)
            const saved = await AsyncStorage.getItem(PRINTER_CONFIG_KEY)
            if (saved) {
                const config = JSON.parse(saved)
                setSavedPrinters(config)
            }
        } catch (error) {
            console.error('Error loading printer config:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const addPrinter = async (config: PrinterConfig) => {
        try {
            const updatedPrinters = {
                ...savedPrinters,
                printers: [...savedPrinters.printers, config],
            }
            await AsyncStorage.setItem(
                PRINTER_CONFIG_KEY,
                JSON.stringify(updatedPrinters)
            )
            setSavedPrinters(updatedPrinters)
            return true
        } catch (error) {
            console.error('Error adding printer:', error)
            return false
        }
    }

    const updatePrinter = async (
        printerId: string,
        updates: Partial<PrinterConfig>
    ) => {
        try {
            const updatedPrinters = {
                ...savedPrinters,
                printers: savedPrinters.printers.map((printer) =>
                    printer.id === printerId
                        ? { ...printer, ...updates }
                        : printer
                ),
            }
            await AsyncStorage.setItem(
                PRINTER_CONFIG_KEY,
                JSON.stringify(updatedPrinters)
            )
            setSavedPrinters(updatedPrinters)
            return true
        } catch (error) {
            console.error('Error updating printer:', error)
            return false
        }
    }

    const deletePrinter = async (printerId: string) => {
        try {
            const updatedPrinters = {
                ...savedPrinters,
                printers: savedPrinters.printers.filter(
                    (printer) => printer.id !== printerId
                ),
                activePrinterId:
                    savedPrinters.activePrinterId === printerId
                        ? undefined
                        : savedPrinters.activePrinterId,
            }
            await AsyncStorage.setItem(
                PRINTER_CONFIG_KEY,
                JSON.stringify(updatedPrinters)
            )
            setSavedPrinters(updatedPrinters)
            return true
        } catch (error) {
            console.error('Error deleting printer:', error)
            return false
        }
    }

    const setActivePrinter = async (printerId: string) => {
        try {
            const updatedPrinters = {
                ...savedPrinters,
                activePrinterId: printerId,
                printers: savedPrinters.printers.map((printer) => ({
                    ...printer,
                    isActive: printer.id === printerId,
                })),
            }
            await AsyncStorage.setItem(
                PRINTER_CONFIG_KEY,
                JSON.stringify(updatedPrinters)
            )
            setSavedPrinters(updatedPrinters)
            return true
        } catch (error) {
            console.error('Error setting active printer:', error)
            return false
        }
    }

    const updatePrinterSettings = async (
        printerId: string,
        settings: Partial<PrinterSettings>
    ) => {
        const printer = savedPrinters.printers.find((p) => p.id === printerId)
        if (!printer) return false

        return await updatePrinter(printerId, {
            settings: { ...printer.settings, ...settings },
        })
    }

    const updateConnectionStatus = async (
        printerId: string,
        isConnected: boolean
    ) => {
        const printer = savedPrinters.printers.find((p) => p.id === printerId)
        if (!printer) return false

        return await updatePrinter(printerId, {
            isConnected,
            lastConnected: isConnected ? new Date() : printer.lastConnected,
        })
    }

    const clearAllPrinters = async () => {
        try {
            await AsyncStorage.removeItem(PRINTER_CONFIG_KEY)
            setSavedPrinters({ printers: [], activePrinterId: undefined })
            return true
        } catch (error) {
            console.error('Error clearing all printers:', error)
            return false
        }
    }

    const getActivePrinter = (): PrinterConfig | null => {
        if (!savedPrinters.activePrinterId) return null
        return (
            savedPrinters.printers.find(
                (p) => p.id === savedPrinters.activePrinterId
            ) || null
        )
    }

    // Sync with backend API
    const syncWithBackend = async () => {
        if (isSyncing) return

        setIsSyncing(true)
        try {
            // First, try to load printers from backend
            const response = await printerAPIService.getPrinters()

            if (response.success && response.data) {
                // Convert API printers to local format
                const apiPrinters: PrinterConfig[] = response.data.printers.map(
                    (printer) => printerAPIService.apiToLocal(printer)
                )

                // Update local storage with backend data
                const updatedSavedPrinters: SavedPrinters = {
                    printers: apiPrinters,
                    activePrinterId: response.data.activePrinter?.id,
                }

                setSavedPrinters(updatedSavedPrinters)
                await AsyncStorage.setItem(
                    PRINTER_CONFIG_KEY,
                    JSON.stringify(updatedSavedPrinters)
                )

                setLastSyncTime(new Date())
                return { success: true, synced: apiPrinters.length }
            } else {
                // If backend sync fails, sync local changes to backend
                const syncResponse = await printerAPIService.syncPrinters(
                    savedPrinters.printers
                )
                return { success: true, synced: syncResponse.synced }
            }
        } catch (error) {
            console.error('Failed to sync with backend:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            }
        } finally {
            setIsSyncing(false)
        }
    }

    // Add printer with backend sync
    const addPrinterWithSync = async (printer: PrinterConfig) => {
        try {
            // Add to local storage first
            await addPrinter(printer)

            // Then sync with backend
            const response = await printerAPIService.createPrinter(
                printerAPIService.localToAPI(printer)
            )

            if (!response.success) {
                console.warn(
                    'Failed to sync printer to backend:',
                    response.error
                )
            }

            return { success: true, printer }
        } catch (error) {
            console.error('Failed to add printer with sync:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            }
        }
    }

    // Update printer with backend sync
    const updatePrinterWithSync = async (
        printerId: string,
        updates: Partial<PrinterConfig>
    ) => {
        try {
            // Update local storage first
            await updatePrinter(printerId, updates)

            // Then sync with backend
            const localPrinter = savedPrinters.printers.find(
                (p) => p.id === printerId
            )
            if (localPrinter) {
                const updatedPrinter = { ...localPrinter, ...updates }
                const response = await printerAPIService.updatePrinter(
                    printerId,
                    {
                        name: updatedPrinter.name,
                        paperSize: updatedPrinter.settings.paperSize,
                        printDensity: updatedPrinter.settings.printDensity,
                        printSpeed: updatedPrinter.settings.printSpeed,
                        autoCut: updatedPrinter.settings.autoCut,
                    }
                )

                if (!response.success) {
                    console.warn(
                        'Failed to sync printer update to backend:',
                        response.error
                    )
                }
            }

            return { success: true }
        } catch (error) {
            console.error('Failed to update printer with sync:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            }
        }
    }

    // Set active printer with backend sync
    const setActivePrinterWithSync = async (printerId: string) => {
        try {
            // Update local storage first
            await setActivePrinter(printerId)

            // Then sync with backend
            const response = await printerAPIService.setActivePrinter(printerId)

            if (!response.success) {
                console.warn(
                    'Failed to sync active printer to backend:',
                    response.error
                )
            }

            return { success: true }
        } catch (error) {
            console.error('Failed to set active printer with sync:', error)
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            }
        }
    }

    // Update connection status with backend sync
    const updateConnectionStatusWithSync = async (
        printerId: string,
        isConnected: boolean
    ) => {
        try {
            // Update local storage first
            await updateConnectionStatus(printerId, isConnected)

            // Then sync with backend
            const response = await printerAPIService.updateConnectionStatus(
                printerId,
                {
                    isConnected,
                    lastConnectedAt: isConnected
                        ? new Date().toISOString()
                        : undefined,
                }
            )

            if (!response.success) {
                console.warn(
                    'Failed to sync connection status to backend:',
                    response.error
                )
            }

            return { success: true }
        } catch (error) {
            console.error(
                'Failed to update connection status with sync:',
                error
            )
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            }
        }
    }

    return {
        savedPrinters,
        activePrinter: getActivePrinter(),
        isLoading,
        isSyncing,
        lastSyncTime,
        addPrinter,
        updatePrinter,
        deletePrinter,
        setActivePrinter,
        updatePrinterSettings,
        updateConnectionStatus,
        clearAllPrinters,
        loadPrinterConfig,
        // New sync functions
        syncWithBackend,
        addPrinterWithSync,
        updatePrinterWithSync,
        setActivePrinterWithSync,
        updateConnectionStatusWithSync,
    }
}
