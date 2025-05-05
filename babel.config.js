module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
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
            // Transform export namespace from
            '@babel/plugin-proposal-export-namespace-from',
            // Reanimated plugin - this should be last
            'react-native-reanimated/plugin',
        ],
    };
};