import { UserProvider } from '@/context/user'
import { addCustomer, deleteCustomer, filterCustomers, getCustomerById, getCustomers, initDB, updateCustomer } from '@/database'
import { QueryClient } from '@tanstack/query-core'
import { QueryClientProvider } from '@tanstack/react-query'
import { Stack } from 'expo-router'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { DefaultTheme, PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import './globals.css'

export default function RootLayout() {
    // const jwtTokenErrors: string[] = [
    //     'Akses ditolak. Token tidak sesuai',
    //     'Token tidak ditemukan',
    //     'Langganan Anda telah kedaluwarsa. Silakan perbarui langganan Anda atau hubungi administrator.',
    // ]

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                throwOnError: true,
            },
            mutations: {
                retry: false,
            },
        },
    })

    const lightTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            primary: '#6200ee', // you can customize
            background: '#ffffff',
            surface: '#ffffff',
            text: '#000000',
            placeholder: '#999999',
        },
    }
  
    useEffect(() => {
      const runCRUD = async () => {
        try {
          await initDB();
          console.log("✅ DB initialized");

          // 1. CREATE
          const newCustomer = await addCustomer({
            merchant_id: "m1",
            name: "John Doe",
            gender: "Laki-laki",
            address: "Jakarta",
            phone_number: "08123456789",
            email: "john@example.com",
          });
          console.log("🟢 Added:", newCustomer);

          const results = await filterCustomers("John Doe");
          console.log("Filtered customers:", results);


          // 2. READ ALL
          const customers = await getCustomers();
          console.log("📖 All customers:", customers);

          // 3. READ ONE
          const singleCustomer = await getCustomerById(newCustomer.id);
          console.log("📖 Single customer:", singleCustomer);

          // 4. UPDATE
          const updated = await updateCustomer(newCustomer.id, {
            name: "John Updated",
            address: "Bandung",
          });
          console.log("✏️ Updated:", updated);

          // 5. DELETE
          await deleteCustomer(newCustomer.id);
          console.log("🗑️ Deleted:", newCustomer.id);

          // Confirm delete
          const afterDelete = await getCustomers();
          console.log("📖 Customers after delete:", afterDelete);
        } catch (err) {
          console.error("❌ CRUD error:", err);
        }
      };

      runCRUD();
    }, []);
  
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <PaperProvider theme={lightTheme}>
                    <QueryClientProvider client={queryClient}>
                        <UserProvider>
                            <Stack screenOptions={{ headerShown: false }}>
                                <Stack.Screen
                                    name="auth/login"
                                    options={{ headerShown: false }}
                                />
                                <Stack.Screen
                                    name="auth/signup"
                                    options={{ headerShown: false }}
                                />
                                <Stack.Screen
                                    name="auth/choosePlan"
                                    options={{ headerShown: false }}
                                />
                                <Stack.Screen name="(tabs)" />
                                <Stack.Screen name="changePassword" />
                            </Stack>
                        </UserProvider>
                    </QueryClientProvider>
                </PaperProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    )
}
