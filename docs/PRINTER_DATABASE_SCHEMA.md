# Printer Database Schema

This document outlines the database schema for managing printer configurations in the backend, allowing users to save their printer settings and avoid re-pairing.

## Database Tables

### 1. `printers` Table

Stores individual printer configurations for each merchant.

```sql
CREATE TABLE printers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    device_name VARCHAR(100) NOT NULL,
    device_id VARCHAR(100) NOT NULL, -- BLE device ID/MAC address
    device_type VARCHAR(50) DEFAULT 'thermal', -- thermal, label, receipt
    connection_type VARCHAR(20) DEFAULT 'bluetooth', -- bluetooth, wifi, usb

    -- Printer Settings
    paper_size VARCHAR(10) DEFAULT '58mm', -- 58mm, 80mm
    print_density INTEGER DEFAULT 8 CHECK (print_density >= 1 AND print_density <= 15),
    print_speed INTEGER DEFAULT 8 CHECK (print_speed >= 1 AND print_speed <= 15),
    auto_cut BOOLEAN DEFAULT true,

    -- Connection Status
    is_active BOOLEAN DEFAULT false, -- Only one printer can be active per merchant
    is_connected BOOLEAN DEFAULT false,
    last_connected_at TIMESTAMP WITH TIME ZONE,

    -- Additional Settings
    custom_settings JSONB DEFAULT '{}', -- For future extensibility

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id),

    -- Constraints
    UNIQUE(merchant_id, device_id),
    UNIQUE(merchant_id, is_active) WHERE is_active = true -- Ensure only one active printer per merchant
);

-- Indexes
CREATE INDEX idx_printers_merchant_id ON printers(merchant_id);
CREATE INDEX idx_printers_device_id ON printers(device_id);
CREATE INDEX idx_printers_active ON printers(merchant_id, is_active);
CREATE INDEX idx_printers_connection ON printers(merchant_id, is_connected);
```

### 2. `printer_templates` Table (Optional)

Pre-defined printer templates for common printer models.

```sql
CREATE TABLE printer_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    device_type VARCHAR(50) DEFAULT 'thermal',

    -- Default Settings
    default_paper_size VARCHAR(10) DEFAULT '58mm',
    default_print_density INTEGER DEFAULT 8,
    default_print_speed INTEGER DEFAULT 8,
    default_auto_cut BOOLEAN DEFAULT true,

    -- Supported Features
    supported_paper_sizes TEXT[] DEFAULT ARRAY['58mm', '80mm'],
    supported_connection_types TEXT[] DEFAULT ARRAY['bluetooth'],

    -- Metadata
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(manufacturer, model)
);

-- Sample data
INSERT INTO printer_templates (name, manufacturer, model, device_type, default_paper_size) VALUES
('Generic 58mm Thermal', 'Generic', '58mm Thermal', 'thermal', '58mm'),
('Generic 80mm Thermal', 'Generic', '80mm Thermal', 'thermal', '80mm'),
('Zebra ZD420', 'Zebra', 'ZD420', 'label', '58mm'),
('Star TSP143', 'Star Micronics', 'TSP143', 'thermal', '58mm');
```

### 3. `printer_connection_logs` Table (Optional)

Log printer connection attempts and status changes.

```sql
CREATE TABLE printer_connection_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    printer_id UUID NOT NULL REFERENCES printers(id) ON DELETE CASCADE,
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,

    action VARCHAR(50) NOT NULL, -- connect, disconnect, scan, pair
    status VARCHAR(20) NOT NULL, -- success, failed, timeout
    error_message TEXT,

    -- Connection Details
    connection_duration INTEGER, -- in seconds
    signal_strength INTEGER, -- RSSI for Bluetooth

    -- Metadata
    device_info JSONB, -- Device details at time of connection
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    INDEX idx_printer_logs_printer_id ON printer_connection_logs(printer_id),
    INDEX idx_printer_logs_merchant_id ON printer_connection_logs(merchant_id),
    INDEX idx_printer_logs_created_at ON printer_connection_logs(created_at)
);
```

## API Endpoints

### Printer Management

```typescript
// GET /api/merchants/{merchantId}/printers
// Get all printers for a merchant
interface GetPrintersResponse {
    printers: Printer[]
    activePrinter: Printer | null
}

// POST /api/merchants/{merchantId}/printers
// Add a new printer
interface CreatePrinterRequest {
    name: string
    deviceName: string
    deviceId: string
    deviceType?: string
    connectionType?: string
    paperSize?: string
    printDensity?: number
    printSpeed?: number
    autoCut?: boolean
    isActive?: boolean
}

// PUT /api/merchants/{merchantId}/printers/{printerId}
// Update printer settings
interface UpdatePrinterRequest {
    name?: string
    paperSize?: string
    printDensity?: number
    printSpeed?: number
    autoCut?: boolean
    customSettings?: Record<string, any>
}

// PUT /api/merchants/{merchantId}/printers/{printerId}/activate
// Set printer as active (deactivates others)
interface ActivatePrinterRequest {
    // No body needed
}

// DELETE /api/merchants/{merchantId}/printers/{printerId}
// Delete a printer

// PUT /api/merchants/{merchantId}/printers/{printerId}/connection
// Update connection status
interface UpdateConnectionRequest {
    isConnected: boolean
    signalStrength?: number
    lastConnectedAt?: string
}
```

### Data Models

```typescript
interface Printer {
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

interface PrinterTemplate {
    id: string
    name: string
    manufacturer: string
    model: string
    deviceType: string
    defaultPaperSize: string
    defaultPrintDensity: number
    defaultPrintSpeed: number
    defaultAutoCut: boolean
    supportedPaperSizes: string[]
    supportedConnectionTypes: string[]
    isActive: boolean
    createdAt: string
    updatedAt: string
}
```

## Database Functions

### Set Active Printer Function

```sql
CREATE OR REPLACE FUNCTION set_active_printer(
    p_merchant_id UUID,
    p_printer_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    printer_exists BOOLEAN;
BEGIN
    -- Check if printer belongs to merchant
    SELECT EXISTS(
        SELECT 1 FROM printers
        WHERE id = p_printer_id AND merchant_id = p_merchant_id
    ) INTO printer_exists;

    IF NOT printer_exists THEN
        RETURN FALSE;
    END IF;

    -- Deactivate all other printers for this merchant
    UPDATE printers
    SET is_active = false, updated_at = NOW()
    WHERE merchant_id = p_merchant_id AND id != p_printer_id;

    -- Activate the specified printer
    UPDATE printers
    SET is_active = true, updated_at = NOW()
    WHERE id = p_printer_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

### Get Active Printer Function

```sql
CREATE OR REPLACE FUNCTION get_active_printer(p_merchant_id UUID)
RETURNS TABLE(
    id UUID,
    name VARCHAR,
    device_name VARCHAR,
    device_id VARCHAR,
    paper_size VARCHAR,
    print_density INTEGER,
    print_speed INTEGER,
    auto_cut BOOLEAN,
    is_connected BOOLEAN,
    last_connected_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.name,
        p.device_name,
        p.device_id,
        p.paper_size,
        p.print_density,
        p.print_speed,
        p.auto_cut,
        p.is_connected,
        p.last_connected_at
    FROM printers p
    WHERE p.merchant_id = p_merchant_id AND p.is_active = true
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;
```

## Migration Strategy

### 1. Phase 1: Database Setup

- Create tables and indexes
- Add printer templates
- Set up API endpoints

### 2. Phase 2: Mobile App Integration

- Update mobile app to sync with backend
- Implement offline-first approach with sync
- Handle connection status updates

### 3. Phase 3: Enhanced Features

- Printer templates integration
- Connection logging
- Advanced printer management

## Security Considerations

1. **Merchant Isolation**: Ensure merchants can only access their own printers
2. **Device ID Validation**: Validate device IDs to prevent conflicts
3. **Rate Limiting**: Limit printer connection attempts
4. **Audit Logging**: Log all printer configuration changes
5. **Data Encryption**: Encrypt sensitive printer data

## Performance Optimizations

1. **Indexing**: Proper indexes on merchant_id, device_id, and is_active
2. **Connection Pooling**: Use connection pooling for database access
3. **Caching**: Cache active printer information
4. **Batch Operations**: Batch multiple printer updates
5. **Pagination**: Implement pagination for printer lists

This schema provides a robust foundation for managing printer configurations in the backend while maintaining data integrity and performance.

