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
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
            bundleIdentifier: 'com.byteik.cucibayargo',
        },
        android: {
            adaptiveIcon: {
                foregroundImage: './assets/images/logo.png',
                backgroundColor: '#ffffff',
            },
            edgeToEdgeEnabled: true,
            package: 'com.byteik.cucibayargo',
            versionCode: 1,
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
