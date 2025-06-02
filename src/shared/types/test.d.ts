declare global {
  namespace NodeJS {
    interface Global {
      mockAxiosInstance: {
        post: jest.MockedFunction<any>;
        get: jest.MockedFunction<any>;
        put: jest.MockedFunction<any>;
        delete: jest.MockedFunction<any>;
        patch: jest.MockedFunction<any>;
        interceptors: {
          request: { use: jest.MockedFunction<any>; eject: jest.MockedFunction<any> };
          response: { use: jest.MockedFunction<any>; eject: jest.MockedFunction<any> };
        };
        defaults: {
          baseURL: string;
          timeout: number;
          headers: Record<string, string>;
        };
      };

      mockSecureStorageService: {
        saveItem: jest.MockedFunction<any>;
        getItem: jest.MockedFunction<any>;
        deleteItem: jest.MockedFunction<any>;
        saveObject: jest.MockedFunction<any>;
        getObject: jest.MockedFunction<any>;
        KEYS: {
          AUTH_TOKEN: string;
          AUTH_USER: string;
        };
      };

      mockSecureStore: {
        getItemAsync: jest.MockedFunction<any>;
        setItemAsync: jest.MockedFunction<any>;
        deleteItemAsync: jest.MockedFunction<any>;
      };
    }
  }

  var mockAxiosInstance: Global['mockAxiosInstance'];
  var mockSecureStorageService: Global['mockSecureStorageService'];
  var mockSecureStore: Global['mockSecureStore'];
}
