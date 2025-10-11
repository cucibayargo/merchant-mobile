# Bluetooth Printer Configuration

This document describes how to set up and use the Bluetooth printer configuration feature in the Cucibayargo Mobile app.

## Overview

The Bluetooth printer configuration allows merchants to:

- Scan for and connect to Bluetooth thermal printers
- Configure printer settings (paper size, print density, speed, etc.)
- Save printer configurations for future use
- Test print functionality

## Features

### 1. Device Scanning

- Automatically scans for nearby Bluetooth devices
- Filters devices to show only those with names (likely printers)
- Real-time scanning with start/stop controls

### 2. Device Connection

- Connect to selected Bluetooth printer
- Automatic permission handling for Android/iOS
- Connection status tracking

### 3. Printer Configuration

- **Paper Size**: Choose between 58mm or 80mm thermal paper
- **Print Density**: Adjust print darkness (1-15 levels)
- **Print Speed**: Configure printing speed (1-15 levels)
- **Auto Cut**: Enable/disable automatic paper cutting

### 4. Test Printing

- Send test print commands to verify connection
- ESC/POS command generation for thermal printers
- Print status feedback

## Setup Instructions

### For Merchants:

1. **Turn on your Bluetooth printer**
2. **Put the printer in pairing mode** (usually by holding a button for 5 seconds)
3. **Open the app** and navigate to Settings → Printer Configuration
4. **Tap "Scan"** to search for available printers
5. **Select your printer** from the list of discovered devices
6. **Configure settings** according to your paper type and preferences
7. **Test the connection** using the "Test Print" button

### Technical Requirements:

- Bluetooth Low Energy (BLE) support
- Android 6.0+ or iOS 10.0+
- Bluetooth permissions granted
- Compatible thermal printer with BLE support

## Supported Printer Commands

The app uses standard ESC/POS commands for thermal printers:

- Text formatting (bold, underline, alignment)
- Font size control
- QR code generation
- Paper cutting
- Line feeds and spacing

## File Structure

```
merchant-mobile/
├── app/settings/
│   ├── index.tsx          # Settings main page
│   └── printer.tsx        # Printer configuration page
├── hooks/
│   ├── bluetooth/
│   │   └── useBLE.ts      # BLE scanning and connection logic
│   └── printer/
│       └── usePrinterConfig.tsx  # Printer configuration management
├── types/
│   └── printer.d.ts       # TypeScript interfaces
└── utils/
    └── printerCommands.ts # ESC/POS command utilities
```

## Configuration Storage

Printer configurations are stored locally using AsyncStorage with the key `printer_config`. The configuration includes:

- Device ID and name
- Connection status
- Last connected timestamp
- Printer settings (paper size, density, speed, auto-cut)

## Troubleshooting

### Common Issues:

1. **Printer not found during scan**
    - Ensure printer is in pairing mode
    - Check Bluetooth is enabled on device
    - Try restarting the scan

2. **Connection fails**
    - Verify Bluetooth permissions are granted
    - Check printer is within range
    - Try disconnecting and reconnecting

3. **Test print doesn't work**
    - Verify printer connection status
    - Check printer has paper loaded
    - Ensure printer supports ESC/POS commands

### Debug Information:

The app logs detailed information to the console for debugging:

- BLE scan results
- Connection attempts
- Print command data
- Error messages

## Future Enhancements

- Support for multiple printer configurations
- Advanced print formatting options
- Receipt template management
- Print queue functionality
- Cloud printer support
