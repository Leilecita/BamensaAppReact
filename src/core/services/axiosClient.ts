import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
 //baseURL: 'http://loteriasole.abarbieri.com.ar/',
 baseURL: 'http://bamensa-dev.abarbieri.com.ar/',
 //baseURL: 'http://192.168.0.47/bam_server/',

 timeout: 10000,
});

api.interceptors.request.use(
 async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  console.log('TOKEN para request:', token);

  const isLoginRequest = config.url?.includes('login.php');

  if (token && !isLoginRequest) {
   config.headers['Session'] = token;
  }

  return config;
 },
 (error) => Promise.reject(error)
);

export default api;
