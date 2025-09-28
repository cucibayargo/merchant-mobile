import { UserProvider } from '@/context/user'
import { initDB } from '@/database'
import { addDuration, deleteDuration, filterDurations, getDurationById, getDurations, updateDuration } from '@/database/models/duration'
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
    const init = async () => {
      await initDB();
    };

    const runDurationCRUD = async () => {
      try {
        console.log("DB initialized");

        const newDuration = await addDuration({
          merchant_id: "m1",
          duration: 60,
          name: "1 Hour",
          type: "Service",
        });
        console.log("Added:", newDuration);

        const filtered = await filterDurations("Hour", 1, 5);
        console.log("Filtered durations:", filtered.data);
        console.log("Filter info:", {
          total: filtered.total,
          page: filtered.page,
          pageSize: filtered.pageSize,
        });

        const durations = await getDurations(1, 10);
        console.log("All durations:", durations.data);
        console.log("Pagination info:", {
          total: durations.total,
          page: durations.page,
          pageSize: durations.pageSize,
        });

        const singleDuration = await getDurationById(newDuration.id);
        console.log("Single duration:", singleDuration);

        const updated = await updateDuration(newDuration.id, {
          name: "2 Hours",
          duration: 120,
        });
        console.log("Updated:", updated);

        await deleteDuration(newDuration.id);
        console.log("Deleted:", newDuration.id);

        const afterDelete = await getDurations(1, 10);
        console.log("Durations after delete:", afterDelete.data);
        console.log("Pagination info after delete:", {
          total: afterDelete.total,
          page: afterDelete.page,
          pageSize: afterDelete.pageSize,
        });
      } catch (err) {
        console.error("CRUD error:", err);
      }
    };
    init();
    runDurationCRUD();
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
