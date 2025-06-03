import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { AppConfig } from './types';

import developmentConfig from './development.json';
import productionConfig from './production.json';

const getEnvironment = (): 'development' | 'production' => {
    if (Constants.expoConfig?.extra?.environment) {
        return Constants.expoConfig.extra.environment as 'development' | 'production';
    }

    return __DEV__ ? 'development' : 'production';
};

const getConfig = (): AppConfig => {
    const environment = getEnvironment();

    const baseConfig = environment === 'production' ? productionConfig : developmentConfig;

    if (environment === 'development' && Platform.OS === 'android' && baseConfig.api.baseUrl.includes('localhost')) {
        return {
            ...baseConfig,
            api: {
                ...baseConfig.api,
                baseUrl: baseConfig.api.baseUrl.replace('localhost', '10.0.2.2')
            },
            environment: environment
        };
    }

    return {
        ...baseConfig,
        environment: environment
    };
};

const config = getConfig();

export default config;