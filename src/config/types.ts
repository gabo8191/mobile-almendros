export interface AppConfig {
    api: {
        baseUrl: string;
        timeout: number;
    };
    auth: {
        storageKeys: {
            token: string;
            user: string;
        };
    };
    version: string;
    environment: 'development' | 'production';
}