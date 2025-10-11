import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { router } from 'expo-router'
import {
    PrinterIcon,
    UserIcon,
    BellIcon,
    ShieldIcon,
    HelpCircleIcon,
} from 'lucide-react-native'

const SettingIndex = () => {
    const settingsItems = [
        {
            id: 'printer',
            title: 'Printer Configuration',
            description: 'Setup and manage Bluetooth printer',
            icon: <PrinterIcon size={24} color="#6B7280" />,
            onPress: () => router.push('/settings/printer/'),
        },
        {
            id: 'profile',
            title: 'Profile Settings',
            description: 'Manage your account information',
            icon: <UserIcon size={24} color="#6B7280" />,
            onPress: () => console.log('Profile settings'),
        },
        {
            id: 'notifications',
            title: 'Notifications',
            description: 'Configure notification preferences',
            icon: <BellIcon size={24} color="#6B7280" />,
            onPress: () => console.log('Notifications'),
        },
        {
            id: 'security',
            title: 'Security & Privacy',
            description: 'Manage security settings',
            icon: <ShieldIcon size={24} color="#6B7280" />,
            onPress: () => console.log('Security'),
        },
        {
            id: 'help',
            title: 'Help & Support',
            description: 'Get help and contact support',
            icon: <HelpCircleIcon size={24} color="#6B7280" />,
            onPress: () => console.log('Help'),
        },
    ]

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-4">
                <Text className="text-2xl font-bold text-gray-900 mb-6">
                    Settings
                </Text>

                <View className="space-y-3">
                    {settingsItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            onPress={item.onPress}
                            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                        >
                            <View className="flex-row items-center">
                                <View className="mr-4">{item.icon}</View>
                                <View className="flex-1">
                                    <Text className="text-lg font-semibold text-gray-900">
                                        {item.title}
                                    </Text>
                                    <Text className="text-sm text-gray-600">
                                        {item.description}
                                    </Text>
                                </View>
                                <Text className="text-gray-400">›</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

export default SettingIndex
