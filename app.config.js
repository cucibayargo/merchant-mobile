import 'dotenv/config'

export default {
    expo: {
        name: 'pos',
        slug: 'pos',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/images/icon.png',
        scheme: 'cucibayargomobile',
        userInterfaceStyle: 'automatic',
        newArchEnabled: false,
        ios: {
            supportsTablet: true,
            bundleIdentifier: 'com.byteik.cucibayargo',
            "config": {
                "usesNonExemptEncryption": false
            }
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/images/logo.png',
                backgroundColor: '#ffffff',
            },
            edgeToEdgeEnabled: false,
            package: 'com.byteik.cucibayargo',
            versionCode: 1,
            permissions: [
                'android.permission.BLUETOOTH',
                'android.permission.BLUETOOTH_ADMIN',
                'android.permission.BLUETOOTH_CONNECT',
                'android.permission.BLUETOOTH_SCAN',
                'android.permission.ACCESS_COARSE_LOCATION',
                'android.permission.ACCESS_FINE_LOCATION',
                'android.permission.INTERNET',
                'android.permission.ACCESS_NETWORK_STATE',
            ],
        },
        web: {
            bundler: 'metro',
            output: 'static',
            favicon: './assets/images/favicon.png',
        },
        plugins: [
            'expo-router',
            [
                'expo-splash-screen',
                {
                    image: './assets/images/logo.png',
                    imageWidth: 200,
                    resizeMode: 'contain',
                    backgroundColor: '#ffffff',
                },
            ],
            'expo-font',
            'expo-web-browser',
            'expo-localization',
            [
                'react-native-ble-plx',
                {
                    isBackgroundEnabled: true,
                    modes: ['peripheral', 'central'],
                    bluetoothAlwaysPermission: 'Allow $(PRODUCT_NAME) to connect to bluetooth devices',
                },
            ],
            [
                "expo-secure-store",
                {
                  "configureAndroidBackup": true,
                  "faceIDPermission": "Allow $(PRODUCT_NAME) to access your Face ID biometric data."
                }
            ]
        ],
        experiments: {
            typedRoutes: true,
        },
        extra: {
            API_URL: process.env.API_URL,
            eas: {
                projectId: 'b782ca64-b8a1-46e1-9cdf-acc37ee96811',
            },
        },
    },
}
