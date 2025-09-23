module.exports = function (api) {
    api.cache(true)
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            // add other ones you truly use (e.g. 'expo-router/babel', 'nativewind/babel')
            'react-native-reanimated/plugin', // keep LAST
        ],
    }
}
