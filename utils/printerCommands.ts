// ESC/POS Printer Commands for Bluetooth Thermal Printers
// This utility provides basic commands for thermal printers

export const ESC_POS_COMMANDS = {
    // Initialize printer
    INIT: '\x1B\x40',

    // Text formatting
    BOLD_ON: '\x1B\x45\x01',
    BOLD_OFF: '\x1B\x45\x00',
    UNDERLINE_ON: '\x1B\x2D\x01',
    UNDERLINE_OFF: '\x1B\x2D\x00',

    // Text alignment
    ALIGN_LEFT: '\x1B\x61\x00',
    ALIGN_CENTER: '\x1B\x61\x01',
    ALIGN_RIGHT: '\x1B\x61\x02',

    // Text size
    FONT_A: '\x1B\x4D\x00', // Normal size
    FONT_B: '\x1B\x4D\x01', // Double width
    FONT_C: '\x1B\x4D\x02', // Double height

    // Line feed
    LINE_FEED: '\x0A',

    // Cut paper
    CUT_PAPER: '\x1D\x56\x00',

    // QR Code
    QR_CODE_SIZE: (size: number) =>
        `\x1D\x28\x6B\x03\x00\x31\x43${String.fromCharCode(size)}`,
    QR_CODE_ERROR_CORRECTION: (level: number) =>
        `\x1D\x28\x6B\x03\x00\x31\x45${String.fromCharCode(level)}`,
    QR_CODE_STORE: (data: string) => {
        const len = data.length + 3
        const lenL = len & 0xff
        const lenH = (len >> 8) & 0xff
        return `\x1D\x28\x6B${String.fromCharCode(lenL)}${String.fromCharCode(lenH)}312${data}`
    },
    QR_CODE_PRINT: '\x1D\x28\x6B\x03\x00\x31\x51\x30',
}

export interface PrintJob {
    text: string
    bold?: boolean
    underline?: boolean
    align?: 'left' | 'center' | 'right'
    fontSize?: 'normal' | 'double-width' | 'double-height'
}

export interface PrintReceiptData {
    header?: string
    items: Array<{
        name: string
        quantity: number
        price: number
    }>
    total: number
    footer?: string
}

export class PrinterCommandBuilder {
    private commands: string[] = []

    init(): PrinterCommandBuilder {
        this.commands.push(ESC_POS_COMMANDS.INIT)
        return this
    }

    align(alignment: 'left' | 'center' | 'right'): PrinterCommandBuilder {
        switch (alignment) {
            case 'left':
                this.commands.push(ESC_POS_COMMANDS.ALIGN_LEFT)
                break
            case 'center':
                this.commands.push(ESC_POS_COMMANDS.ALIGN_CENTER)
                break
            case 'right':
                this.commands.push(ESC_POS_COMMANDS.ALIGN_RIGHT)
                break
        }
        return this
    }

    bold(on: boolean = true): PrinterCommandBuilder {
        this.commands.push(
            on ? ESC_POS_COMMANDS.BOLD_ON : ESC_POS_COMMANDS.BOLD_OFF
        )
        return this
    }

    underline(on: boolean = true): PrinterCommandBuilder {
        this.commands.push(
            on ? ESC_POS_COMMANDS.UNDERLINE_ON : ESC_POS_COMMANDS.UNDERLINE_OFF
        )
        return this
    }

    fontSize(
        size: 'normal' | 'double-width' | 'double-height'
    ): PrinterCommandBuilder {
        switch (size) {
            case 'normal':
                this.commands.push(ESC_POS_COMMANDS.FONT_A)
                break
            case 'double-width':
                this.commands.push(ESC_POS_COMMANDS.FONT_B)
                break
            case 'double-height':
                this.commands.push(ESC_POS_COMMANDS.FONT_C)
                break
        }
        return this
    }

    text(content: string): PrinterCommandBuilder {
        this.commands.push(content)
        return this
    }

    lineFeed(lines: number = 1): PrinterCommandBuilder {
        for (let i = 0; i < lines; i++) {
            this.commands.push(ESC_POS_COMMANDS.LINE_FEED)
        }
        return this
    }

    qrCode(
        data: string,
        size: number = 6,
        errorCorrection: number = 1
    ): PrinterCommandBuilder {
        this.commands.push(ESC_POS_COMMANDS.QR_CODE_SIZE(size))
        this.commands.push(
            ESC_POS_COMMANDS.QR_CODE_ERROR_CORRECTION(errorCorrection)
        )
        this.commands.push(ESC_POS_COMMANDS.QR_CODE_STORE(data))
        this.commands.push(ESC_POS_COMMANDS.QR_CODE_PRINT)
        return this
    }

    cutPaper(): PrinterCommandBuilder {
        this.commands.push(ESC_POS_COMMANDS.CUT_PAPER)
        return this
    }

    build(): string {
        return this.commands.join('')
    }

    // Helper method to create a test print
    static createTestPrint(): string {
        return new PrinterCommandBuilder()
            .init()
            .align('center')
            .bold(true)
            .fontSize('double-width')
            .text('TEST PRINT')
            .bold(false)
            .fontSize('normal')
            .lineFeed(2)
            .align('left')
            .text('Date: ' + new Date().toLocaleString())
            .lineFeed(1)
            .text('Device: Bluetooth Printer')
            .lineFeed(1)
            .text('Status: Connected')
            .lineFeed(3)
            .align('center')
            .text('--- Test Successful ---')
            .lineFeed(2)
            .cutPaper()
            .build()
    }

    // Helper method to create a receipt
    static createReceipt(data: PrintReceiptData): string {
        const builder = new PrinterCommandBuilder()
            .init()
            .align('center')
            .bold(true)
            .fontSize('double-width')

        if (data.header) {
            builder.text(data.header)
        } else {
            builder.text('RECEIPT')
        }

        builder
            .bold(false)
            .fontSize('normal')
            .lineFeed(2)
            .align('left')
            .text('Date: ' + new Date().toLocaleString())
            .lineFeed(2)

        // Items
        data.items.forEach((item) => {
            builder
                .text(`${item.name}`)
                .align('right')
                .text(`$${item.price.toFixed(2)}`)
                .align('left')
                .lineFeed(1)
        })

        builder
            .lineFeed(1)
            .text('--------------------------------')
            .lineFeed(1)
            .bold(true)
            .text('TOTAL:')
            .align('right')
            .text(`$${data.total.toFixed(2)}`)
            .bold(false)
            .align('left')

        if (data.footer) {
            builder.lineFeed(2).align('center').text(data.footer)
        }

        builder.lineFeed(3).cutPaper()

        return builder.build()
    }
}

// Utility function to convert string to bytes for BLE transmission
export const stringToBytes = (str: string): number[] => {
    const bytes: number[] = []
    for (let i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i))
    }
    return bytes
}

// Utility function to convert bytes back to string
export const bytesToString = (bytes: number[]): string => {
    return String.fromCharCode(...bytes)
}
