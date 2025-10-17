import 'dotenv/config'
import { ExpoConfig } from 'expo/config'

const EAS_PROJECT_ID = 'b782ca64-b8a1-46e1-9cdf-acc37ee96811'
const OWNER = 'cucibayargo'

// App production config
const APP_NAME = 'cucibayargo'
const BUNDLE_IDENTIFIER = 'com.byteik.cucibayargo'
const PACKAGE_NAME = 'com.byteik.cucibayargo'
const ICON = './assets/images/icon.png'
const ADAPTIVE_ICON = './assets/images/logo.png'
const SCHEME = 'app-scheme'

export default ({ config }: { config: ExpoConfig }) => {
    console.log('⚙️ Building app for environment:', process.env.APP_ENV)
    console.log('⚙️ api url:', process.env.EXPO_PUBLIC_API_URL)
    const { name, bundleIdentifier, icon, adaptiveIcon, packageName, scheme } =
        getDynamicAppConfig(
            (process.env.APP_ENV as 'development' | 'preview' | 'production') ||
                'development'
        )

    return {
        expo: {
            name: name,
            slug: 'pos',
            version: '1.0.1',
            orientation: 'portrait',
            icon: icon,
            scheme: scheme,
            userInterfaceStyle: 'automatic',
            newArchEnabled: false,
            ios: {
                supportsTablet: true,
                bundleIdentifier: bundleIdentifier,
                config: {
                    usesNonExemptEncryption: false,
                },
            },
            android: {
                adaptiveIcon: {
                    foregroundImage: adaptiveIcon,
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
                        bluetoothAlwaysPermission:
                            'Allow $(PRODUCT_NAME) to connect to bluetooth devices',
                    },
                ],
                [
                    'expo-secure-store',
                    {
                        configureAndroidBackup: true,
                        faceIDPermission:
                            'Allow $(PRODUCT_NAME) to access your Face ID biometric data.',
                    },
                ],
            ],
            experiments: {
                typedRoutes: true,
            },
            updates: {
                url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
            },
            runtimeVersion: {
                policy: 'appVersion',
            },
            extra: {
                eas: {
                    projectId: EAS_PROJECT_ID,
                },
            },
            owner: OWNER,
        },
    }
}

// Dynamically configure the app based on the environment.
// Update these placeholders with your actual values.
export const getDynamicAppConfig = (
    environment: 'development' | 'preview' | 'production'
) => {
    if (environment === 'production') {
        return {
            name: APP_NAME,
            bundleIdentifier: BUNDLE_IDENTIFIER,
            packageName: PACKAGE_NAME,
            icon: ICON,
            adaptiveIcon: ADAPTIVE_ICON,
            scheme: SCHEME,
        }
    }

    if (environment === 'preview') {
        return {
            name: `${APP_NAME} Preview`,
            bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
            packageName: `${PACKAGE_NAME}.preview`,
            icon: ICON,
            adaptiveIcon: ADAPTIVE_ICON,
            scheme: `${SCHEME}-prev`,
        }
    }

    return {
        name: `${APP_NAME} Development`,
        bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
        packageName: `${PACKAGE_NAME}.dev`,
        icon: ICON,
        adaptiveIcon: ADAPTIVE_ICON,
        scheme: `${SCHEME}-dev`,
    }
}
