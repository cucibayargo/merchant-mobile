import 'dotenv/config'

export default {
    expo: {
        name: 'cucibayargo-mobile',
        slug: 'cucibayargo-mobile',
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/images/icon.png',
        scheme: 'cucibayargomobile',
        userInterfaceStyle: 'automatic',
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
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
        ],
        experiments: {
            typedRoutes: true,
        },
        extra: {
            API_URL: process.env.API_URL,
            eas: {
                projectId: '45a379d1-8bdf-413f-927c-785e4a15d0a1',
            },
        },
    },
}
