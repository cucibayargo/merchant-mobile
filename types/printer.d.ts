export interface PrinterConfig {
    id: string
    name: string
    deviceName: string // Original device name from BLE
    macAddress?: string
    isConnected: boolean
    lastConnected?: Date
    isActive: boolean // Currently selected printer
    settings: {
        paperSize: '58mm' | '80mm'
        printDensity: number // 1-15
        printSpeed: number // 1-15
        autoCut: boolean
    }
}

export interface SavedPrinters {
    printers: PrinterConfig[]
    activePrinterId?: string
}

export interface PrinterDevice {
    id: string
    name: string | null
    localName: string | null
    rssi: number | null
    isConnectable: boolean | null
    manufacturerData: string | null
    serviceUUIDs: string[] | null
}

export interface PrinterSettings {
    paperSize: '58mm' | '80mm'
    printDensity: number
    printSpeed: number
    autoCut: boolean
}
