import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const createClient = (baseURL: string, timeout: number) =>
 axios.create({
  baseURL,
  timeout,
 });

export const attachSessionInterceptor = (client: ReturnType<typeof createClient>) => {
 client.interceptors.request.use(
  async (config) => {
   const token = await AsyncStorage.getItem('userToken');
   const isLoginRequest = config.url?.includes('login.php');

   if (token && !isLoginRequest) {
    config.headers['Session'] = token;
   }

   return config;
  },
  (error) => Promise.reject(error)
 );
 return client;
};

export const attachDebugInterceptors = (client: ReturnType<typeof createClient>) => {
 client.interceptors.request.use(
  async (config) => {
   const token = await AsyncStorage.getItem('userToken');
   const isLoginRequest = config.url?.includes('login.php');

   if (__DEV__) {
    const method = (config.method || 'get').toUpperCase();
    const safeParams = isLoginRequest
     ? { ...(config.params || {}), hash_password: '***' }
     : config.params;
    console.log('[API REQUEST]', {
     method,
     url: `${config.baseURL || ''}${config.url || ''}`,
     params: safeParams,
     hasToken: !!token,
    });
   }

   if (token && !isLoginRequest) {
    config.headers['Session'] = token;
   }

   return config;
  },
  (error) => Promise.reject(error)
 );

 client.interceptors.response.use(
  (response) => response,
  (error) => {
   if (__DEV__) {
    const status = error?.response?.status;
    const method = (error?.config?.method || 'get').toUpperCase();
    const url = `${error?.config?.baseURL || ''}${error?.config?.url || ''}`;
    const responseData = error?.response?.data;
    console.log('[API ERROR]', { method, url, status, responseData });
   }
   return Promise.reject(error);
  }
 );

 return client;
};
