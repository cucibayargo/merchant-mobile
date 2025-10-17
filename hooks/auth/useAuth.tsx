import { useUser } from '@/context/user'
import useGetUserDetails from '@/hooks/user/useGetUserDetails'
import * as SecureStore from 'expo-secure-store'
import { useEffect } from 'react'

const useAuth = () => {
    const { setIsLoading } = useUser()
    const { mutateAsync: getUserDetails } = useGetUserDetails()

    useEffect(() => {
        const checkAuthToken = async () => {
            try {
                const token = await SecureStore.getItem('authToken')
                if (token) {
                    // Token exists, try to get user details
                    try {
                        await getUserDetails()
                    } catch (error) {
                        // Token is invalid, remove it
                        await SecureStore.deleteItemAsync('authToken')
                    }
                }
            } catch (error) {
                console.log('Error checking auth token:', error)
            } finally {
                setIsLoading(false)
            }
        }

        checkAuthToken()
    }, [getUserDetails, setIsLoading])
}

export default useAuth

