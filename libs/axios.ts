import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
// import { API_URL } from '@env'

const axiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    withCredentials: true,
})

// Add token to requests automatically
axiosInstance.interceptors.request.use(async (config) => {
    try {
        const token = await SecureStore.getItem('authToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
    } catch (error) {
        console.log('Error getting auth token:', error)
    }
    return config
})

axiosInstance.interceptors.request.use((config) => {
    ;(config as any).__startedAt = Date.now()
    const { method, url, headers, data } = config
    console.log('➡️ [REQ]', method?.toUpperCase(), url, {
        headers,
        // Beware logging very large bodies or files:
        data: typeof data === 'string' ? data.slice(0, 1000) : data,
    })
    return config
})

axiosInstance.interceptors.response.use(
    (response) => {
        const ms =
            Date.now() - ((response.config as any).__startedAt ?? Date.now())
        console.log(
            '✅ [RES]',
            response.status,
            response.config.url,
            `${ms}ms`,
            {
                // trim big payloads:
                data:
                    typeof response.data === 'string'
                        ? response.data.slice(0, 1000)
                        : response.data,
            }
        )

        return response
    },
    async (error) => {
        const cfg = error.config || {}
        const ms = Date.now() - ((cfg as any).__startedAt ?? Date.now())

        // Handle authentication errors
        if (error.response?.status === 401) {
            try {
                await SecureStore.deleteItemAsync('authToken')
                // Redirect to login page
                const { router } = await import('expo-router')
                router.replace('/auth/login')
            } catch (e) {
                console.log('Error during logout:', e)
            }
        }

        if (error.response) {
            console.log(
                '❌ [ERR]',
                error.response.status,
                cfg?.url,
                `${ms}ms`,
                {
                    data: error.response.data,
                }
            )
        } else {
            console.log(
                '❌ [ERR]',
                cfg?.url,
                `${ms}ms`,
                error.response?.data?.message || error.message
            )
        }

        if (error.response?.data?.message) {
            alert(error.response.data.message)
        }
        return Promise.reject(error)
    }
)

export default axiosInstance
