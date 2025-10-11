import AsyncStorage from '@react-native-async-storage/async-storage'
import {
    PrinterAPI,
    CreatePrinterRequest,
    UpdatePrinterRequest,
    UpdateConnectionRequest,
    GetPrintersResponse,
    APIResponse,
    PrinterSyncData,
    SyncResponse,
    BulkOperationResponse,
} from '../types/printer-api'
import { PrinterConfig } from '../types/printer'

const API_BASE_URL =
    process.env.EXPO_PUBLIC_API_URL || 'https://api.cucibayargo.com'
const SYNC_KEY = 'printer_sync_data'
const MERCHANT_ID_KEY = 'merchant_id'

class PrinterAPIService {
    private merchantId: string | null = null

    constructor() {
        this.loadMerchantId()
    }

    private async loadMerchantId(): Promise<void> {
        try {
            this.merchantId = await AsyncStorage.getItem(MERCHANT_ID_KEY)
        } catch (error) {
            console.error('Failed to load merchant ID:', error)
        }
    }

    private async getAuthHeaders(): Promise<Record<string, string>> {
        const token = await AsyncStorage.getItem('auth_token')
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<APIResponse<T>> {
        try {
            const headers = await this.getAuthHeaders()
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    ...headers,
                    ...options.headers,
                },
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error?.message || 'Request failed')
            }

            return data
        } catch (error) {
            console.error('API request failed:', error)
            return {
                success: false,
                error: {
                    code: 'NETWORK_ERROR',
                    message:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                },
            }
        }
    }

    // Get all printers for the current merchant
    async getPrinters(): Promise<APIResponse<GetPrintersResponse>> {
        if (!this.merchantId) {
            return {
                success: false,
                error: {
                    code: 'NO_MERCHANT_ID',
                    message: 'Merchant ID not found',
                },
            }
        }

        return this.request<GetPrintersResponse>(
            `/api/merchants/${this.merchantId}/printers`
        )
    }

    // Create a new printer
    async createPrinter(
        printerData: CreatePrinterRequest
    ): Promise<APIResponse<PrinterAPI>> {
        if (!this.merchantId) {
            return {
                success: false,
                error: {
                    code: 'NO_MERCHANT_ID',
                    message: 'Merchant ID not found',
                },
            }
        }

        return this.request<PrinterAPI>(
            `/api/merchants/${this.merchantId}/printers`,
            {
                method: 'POST',
                body: JSON.stringify(printerData),
            }
        )
    }

    // Update printer settings
    async updatePrinter(
        printerId: string,
        updateData: UpdatePrinterRequest
    ): Promise<APIResponse<PrinterAPI>> {
        if (!this.merchantId) {
            return {
                success: false,
                error: {
                    code: 'NO_MERCHANT_ID',
                    message: 'Merchant ID not found',
                },
            }
        }

        return this.request<PrinterAPI>(
            `/api/merchants/${this.merchantId}/printers/${printerId}`,
            {
                method: 'PUT',
                body: JSON.stringify(updateData),
            }
        )
    }

    // Set printer as active
    async setActivePrinter(
        printerId: string
    ): Promise<APIResponse<PrinterAPI>> {
        if (!this.merchantId) {
            return {
                success: false,
                error: {
                    code: 'NO_MERCHANT_ID',
                    message: 'Merchant ID not found',
                },
            }
        }

        return this.request<PrinterAPI>(
            `/api/merchants/${this.merchantId}/printers/${printerId}/activate`,
            {
                method: 'PUT',
            }
        )
    }

    // Update printer connection status
    async updateConnectionStatus(
        printerId: string,
        connectionData: UpdateConnectionRequest
    ): Promise<APIResponse<void>> {
        if (!this.merchantId) {
            return {
                success: false,
                error: {
                    code: 'NO_MERCHANT_ID',
                    message: 'Merchant ID not found',
                },
            }
        }

        return this.request<void>(
            `/api/merchants/${this.merchantId}/printers/${printerId}/connection`,
            {
                method: 'PUT',
                body: JSON.stringify(connectionData),
            }
        )
    }

    // Delete a printer
    async deletePrinter(printerId: string): Promise<APIResponse<void>> {
        if (!this.merchantId) {
            return {
                success: false,
                error: {
                    code: 'NO_MERCHANT_ID',
                    message: 'Merchant ID not found',
                },
            }
        }

        return this.request<void>(
            `/api/merchants/${this.merchantId}/printers/${printerId}`,
            {
                method: 'DELETE',
            }
        )
    }

    // Sync local printers with server
    async syncPrinters(localPrinters: PrinterConfig[]): Promise<SyncResponse> {
        try {
            const syncData = await this.getSyncData()
            const conflicts: any[] = []
            const errors: any[] = []

            for (const localPrinter of localPrinters) {
                const existingSync = syncData.find(
                    (s) => s.localPrinter.id === localPrinter.id
                )

                if (existingSync) {
                    // Update existing sync data
                    const updatedSync: PrinterSyncData = {
                        ...existingSync,
                        localPrinter,
                        syncStatus: 'pending',
                        pendingChanges: this.getChangedFields(
                            existingSync.localPrinter,
                            localPrinter
                        ),
                    }

                    // Sync with server
                    const result = await this.syncSinglePrinter(updatedSync)
                    if (result.conflicts.length > 0) {
                        conflicts.push(...result.conflicts)
                    }
                    if (result.errors.length > 0) {
                        errors.push(...result.errors)
                    }
                } else {
                    // Create new printer on server
                    const createRequest: CreatePrinterRequest = {
                        name: localPrinter.name,
                        deviceName: localPrinter.deviceName,
                        deviceId: localPrinter.id,
                        deviceType: 'thermal',
                        connectionType: 'bluetooth',
                        paperSize: localPrinter.settings.paperSize,
                        printDensity: localPrinter.settings.printDensity,
                        printSpeed: localPrinter.settings.printSpeed,
                        autoCut: localPrinter.settings.autoCut,
                        isActive: localPrinter.isActive,
                    }

                    const response = await this.createPrinter(createRequest)
                    if (!response.success) {
                        errors.push({
                            printerId: localPrinter.id,
                            error:
                                response.error?.message ||
                                'Failed to create printer',
                            code: response.error?.code || 'UNKNOWN',
                        })
                    }
                }
            }

            return {
                synced: conflicts.length === 0 && errors.length === 0,
                conflicts,
                errors,
            }
        } catch (error) {
            console.error('Failed to sync printers:', error)
            return {
                synced: false,
                conflicts: [],
                errors: [
                    {
                        printerId: 'all',
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Unknown error',
                        code: 'SYNC_ERROR',
                    },
                ],
            }
        }
    }

    private async syncSinglePrinter(syncData: PrinterSyncData): Promise<{
        conflicts: any[]
        errors: any[]
    }> {
        const conflicts: any[] = []
        const errors: any[] = []

        try {
            if (syncData.serverPrinter) {
                // Update existing printer
                const updateRequest: UpdatePrinterRequest = {}

                for (const field of syncData.pendingChanges) {
                    switch (field) {
                        case 'name':
                            updateRequest.name = syncData.localPrinter.name
                            break
                        case 'settings.paperSize':
                            updateRequest.paperSize =
                                syncData.localPrinter.settings.paperSize
                            break
                        case 'settings.printDensity':
                            updateRequest.printDensity =
                                syncData.localPrinter.settings.printDensity
                            break
                        case 'settings.printSpeed':
                            updateRequest.printSpeed =
                                syncData.localPrinter.settings.printSpeed
                            break
                        case 'settings.autoCut':
                            updateRequest.autoCut =
                                syncData.localPrinter.settings.autoCut
                            break
                    }
                }

                const response = await this.updatePrinter(
                    syncData.serverPrinter.id,
                    updateRequest
                )
                if (!response.success) {
                    errors.push({
                        printerId: syncData.localPrinter.id,
                        error:
                            response.error?.message ||
                            'Failed to update printer',
                        code: response.error?.code || 'UNKNOWN',
                    })
                }
            }

            // Update connection status
            if (
                syncData.localPrinter.isConnected !==
                syncData.serverPrinter?.isConnected
            ) {
                const connectionUpdate: UpdateConnectionRequest = {
                    isConnected: syncData.localPrinter.isConnected,
                    lastConnectedAt: syncData.localPrinter.lastConnected
                        ? new Date(
                              syncData.localPrinter.lastConnected
                          ).toISOString()
                        : undefined,
                }

                const response = await this.updateConnectionStatus(
                    syncData.serverPrinter?.id || syncData.localPrinter.id,
                    connectionUpdate
                )

                if (!response.success) {
                    errors.push({
                        printerId: syncData.localPrinter.id,
                        error:
                            response.error?.message ||
                            'Failed to update connection status',
                        code: response.error?.code || 'UNKNOWN',
                    })
                }
            }
        } catch (error) {
            errors.push({
                printerId: syncData.localPrinter.id,
                error: error instanceof Error ? error.message : 'Unknown error',
                code: 'SYNC_ERROR',
            })
        }

        return { conflicts, errors }
    }

    private getChangedFields(
        oldPrinter: PrinterConfig,
        newPrinter: PrinterConfig
    ): string[] {
        const changes: string[] = []

        if (oldPrinter.name !== newPrinter.name) changes.push('name')
        if (oldPrinter.settings.paperSize !== newPrinter.settings.paperSize)
            changes.push('settings.paperSize')
        if (
            oldPrinter.settings.printDensity !==
            newPrinter.settings.printDensity
        )
            changes.push('settings.printDensity')
        if (oldPrinter.settings.printSpeed !== newPrinter.settings.printSpeed)
            changes.push('settings.printSpeed')
        if (oldPrinter.settings.autoCut !== newPrinter.settings.autoCut)
            changes.push('settings.autoCut')
        if (oldPrinter.isConnected !== newPrinter.isConnected)
            changes.push('isConnected')

        return changes
    }

    private async getSyncData(): Promise<PrinterSyncData[]> {
        try {
            const data = await AsyncStorage.getItem(SYNC_KEY)
            return data ? JSON.parse(data) : []
        } catch (error) {
            console.error('Failed to load sync data:', error)
            return []
        }
    }

    private async saveSyncData(syncData: PrinterSyncData[]): Promise<void> {
        try {
            await AsyncStorage.setItem(SYNC_KEY, JSON.stringify(syncData))
        } catch (error) {
            console.error('Failed to save sync data:', error)
        }
    }

    // Convert local PrinterConfig to API format
    static localToAPI(localPrinter: PrinterConfig): CreatePrinterRequest {
        return {
            name: localPrinter.name,
            deviceName: localPrinter.deviceName,
            deviceId: localPrinter.id,
            deviceType: 'thermal',
            connectionType: 'bluetooth',
            paperSize: localPrinter.settings.paperSize,
            printDensity: localPrinter.settings.printDensity,
            printSpeed: localPrinter.settings.printSpeed,
            autoCut: localPrinter.settings.autoCut,
            isActive: localPrinter.isActive,
        }
    }

    // Convert API PrinterAPI to local format
    static apiToLocal(apiPrinter: PrinterAPI): PrinterConfig {
        return {
            id: apiPrinter.id,
            name: apiPrinter.name,
            deviceName: apiPrinter.deviceName,
            isActive: apiPrinter.isActive,
            isConnected: apiPrinter.isConnected,
            lastConnected: apiPrinter.lastConnectedAt,
            settings: {
                paperSize: apiPrinter.paperSize,
                printDensity: apiPrinter.printDensity,
                printSpeed: apiPrinter.printSpeed,
                autoCut: apiPrinter.autoCut,
            },
        }
    }
}

export default new PrinterAPIService()
