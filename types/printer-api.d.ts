// Backend API Types for Printer Management

export interface PrinterAPI {
    id: string
    merchantId: string
    name: string
    deviceName: string
    deviceId: string
    deviceType: 'thermal' | 'label' | 'receipt'
    connectionType: 'bluetooth' | 'wifi' | 'usb'

    // Settings
    paperSize: '58mm' | '80mm'
    printDensity: number // 1-15
    printSpeed: number // 1-15
    autoCut: boolean
    customSettings: Record<string, any>

    // Status
    isActive: boolean
    isConnected: boolean
    lastConnectedAt: string | null

    // Metadata
    createdAt: string
    updatedAt: string
    createdBy: string
    updatedBy: string
}

export interface CreatePrinterRequest {
    name: string
    deviceName: string
    deviceId: string
    deviceType?: 'thermal' | 'label' | 'receipt'
    connectionType?: 'bluetooth' | 'wifi' | 'usb'
    paperSize?: '58mm' | '80mm'
    printDensity?: number
    printSpeed?: number
    autoCut?: boolean
    isActive?: boolean
    customSettings?: Record<string, any>
}

export interface UpdatePrinterRequest {
    name?: string
    paperSize?: '58mm' | '80mm'
    printDensity?: number
    printSpeed?: number
    autoCut?: boolean
    customSettings?: Record<string, any>
}

export interface UpdateConnectionRequest {
    isConnected: boolean
    signalStrength?: number
    lastConnectedAt?: string
}

export interface GetPrintersResponse {
    printers: PrinterAPI[]
    activePrinter: PrinterAPI | null
}

export interface PrinterTemplate {
    id: string
    name: string
    manufacturer: string
    model: string
    deviceType: 'thermal' | 'label' | 'receipt'
    defaultPaperSize: '58mm' | '80mm'
    defaultPrintDensity: number
    defaultPrintSpeed: number
    defaultAutoCut: boolean
    supportedPaperSizes: ('58mm' | '80mm')[]
    supportedConnectionTypes: ('bluetooth' | 'wifi' | 'usb')[]
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface PrinterConnectionLog {
    id: string
    printerId: string
    merchantId: string
    action: 'connect' | 'disconnect' | 'scan' | 'pair'
    status: 'success' | 'failed' | 'timeout'
    errorMessage?: string
    connectionDuration?: number // in seconds
    signalStrength?: number // RSSI for Bluetooth
    deviceInfo?: Record<string, any>
    createdAt: string
}

// API Response Types
export interface APIResponse<T> {
    success: boolean
    data?: T
    error?: {
        code: string
        message: string
        details?: any
    }
    meta?: {
        total?: number
        page?: number
        limit?: number
    }
}

// Sync Types for Offline-First Approach
export interface PrinterSyncData {
    localPrinter: PrinterConfig // From local types/printer.d.ts
    serverPrinter?: PrinterAPI
    syncStatus: 'pending' | 'synced' | 'conflict' | 'error'
    lastSyncAt?: string
    pendingChanges: string[] // Array of changed field names
}

export interface SyncResponse {
    synced: boolean
    conflicts: PrinterSyncConflict[]
    errors: PrinterSyncError[]
}

export interface PrinterSyncConflict {
    printerId: string
    field: string
    localValue: any
    serverValue: any
    resolution: 'local' | 'server' | 'manual'
}

export interface PrinterSyncError {
    printerId: string
    error: string
    code: string
}

// WebSocket Types for Real-time Updates
export interface PrinterWebSocketMessage {
    type:
        | 'printer_connected'
        | 'printer_disconnected'
        | 'printer_updated'
        | 'printer_deleted'
    merchantId: string
    printerId: string
    data?: Partial<PrinterAPI>
    timestamp: string
}

// Bulk Operations
export interface BulkPrinterOperation {
    operation: 'create' | 'update' | 'delete' | 'activate'
    printerIds: string[]
    data?: Partial<CreatePrinterRequest | UpdatePrinterRequest>
}

export interface BulkOperationResponse {
    success: boolean
    results: Array<{
        printerId: string
        success: boolean
        error?: string
    }>
    summary: {
        total: number
        successful: number
        failed: number
    }
}
