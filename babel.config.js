module.exports = function (api) {
    api.cache(true)
    return {
        // plugins: [
        //     [
        //         'module:react-native-dotenv',
        //         {
        //             moduleName: '@env',
        //             path: '.env',
        //         },
        //     ],
        // ],
        presets: [
            ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
            'nativewind/babel',
        ],

        plugins: [
            'react-native-worklets/plugin',
            [
                'module-resolver',
                {
                    root: ['./'],

                    alias: {
                        '@': './',
                        'tailwind.config': './tailwind.config.js',
                    },
                },
            ],
        ],
    }
}
