module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            // Required for expo-router
            'expo-router/babel',
            // Reanimated plugin (optional)
            '@babel/plugin-proposal-export-namespace-from',
            'react-native-reanimated/plugin',
            // Add path alias support
            [
                'module-resolver',
                {
                    root: ['.'],
                    extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
                    alias: {
                        '@': './',
                    },
                },
            ],
        ],
    };
};