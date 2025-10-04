import axios from 'axios'
import Constants from 'expo-constants'
// import { API_URL } from '@env'

const axiosInstance = axios.create({
    baseURL: Constants.expoConfig?.extra?.API_URL,
    withCredentials: true,
})

console.log("API_URL:", Constants.expoConfig?.extra?.API_URL)

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
                error.response.data.message
            )
        }

        alert(error.response.data.message)
        return Promise.reject(error)
    }
)

export default axiosInstance
