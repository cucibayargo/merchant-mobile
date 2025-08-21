import { Text } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'

const Home = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>Selamat Datang</Text>
            <Text style={styles.username}>Rama</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    greeting: {
        fontSize: 15,
        fontWeight: 'semibold',
        marginBottom: 10,
        color: 'black',
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
})

export default Home
