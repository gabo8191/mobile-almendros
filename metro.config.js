// Learn more: https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add resolver for @ paths and ensure nanoid resolves correctly
config.resolver.extraNodeModules = {
    '@': path.resolve(__dirname),
    'nanoid': path.resolve(__dirname, 'node_modules/nanoid'),
};

// Treat these extensions as source files and these as assets
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];
config.resolver.assetExts = ['db', 'ttf', 'png', 'jpg', 'jpeg', 'svg', 'webp'];

// Debugging hook: log when resolving nanoid/non-secure
config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === 'nanoid/non-secure') {
        const filePath = path.resolve(__dirname, 'node_modules/nanoid/non-secure/index.js');
        console.log(`Resolving nanoid/non-secure → ${filePath}`);
        return { filePath, type: 'sourceFile' };
    }
    // fallback to default resolver
    return context.resolveRequest(context, moduleName, platform);
};

// Speed up bundling by increasing the number of workers
config.maxWorkers = 8;

module.exports = config;
