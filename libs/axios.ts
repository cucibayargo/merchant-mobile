import axios from 'axios'
import Constants from 'expo-constants'
// import { API_URL } from '@env'

const axiosInstance = axios.create({
    baseURL: Constants.expoConfig?.extra?.API_URL,
    withCredentials: true,
})

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        alert(error.response.data.message)
        return Promise.reject(error)
    }
)

export default axiosInstance
