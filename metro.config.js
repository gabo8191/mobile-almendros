// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add resolver for @ paths
config.resolver.extraNodeModules = {
    '@': path.resolve(__dirname),
};

// Ensure all imports that start with @ are considered local
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];
config.resolver.assetExts = ['db', 'ttf', 'png', 'jpg', 'jpeg', 'svg', 'webp'];

module.exports = config;