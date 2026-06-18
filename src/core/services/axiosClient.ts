import axios from 'axios';
import {
 attachDebugInterceptors,
 attachSessionInterceptor,
 createClient,
} from './axiosClient.helpers';

//ROSARIO
//export const BASE_URL = 'http://loteriasole.abarbieri.com.ar/'; //ahora usa esta dire 

//FISHERTON
// public static final String BASE_URL = "http://bam_fisherton.abarbieri.com.ar/"; YA NO SE USA 

//export const BASE_URL = "http://frutos-dev.abarbieri.com.ar/"; //ahora usa esta direccion

//LOCALHOST
export const BASE_URL = 'http://192.168.0.191/bam_server/';


//-------------------------

//FISHERTON dejarla siempre es para que desde Bamensa Change App puedan ver las cajas de Fisherton
// SOLO LECTURA | NO SE TOCA
//public static final String BASE_URL2 = "http://bam_fisherton.abarbieri.com.ar/";

export const BASE_URL2 = 'http://frutos-dev.abarbieri.com.ar/';

//-------------------------

// ROSARIO para postear operaciones cuando se esta en fisherton
// public static final String BASE_URL3 = "http://bamensa.abarbieri.com.ar/";
export const BASE_URL3 = 'http://loteriasole.abarbieri.com.ar/';


//public static final String BASE_URL3 = "http://192.168.0.36/bam_server/"; // es para tester

//-------------------------

const TIMEOUT = 10000;

const api = axios.create({
 baseURL: BASE_URL.replace(/\/+$/, ''),
 timeout: TIMEOUT,
});

export const getAPIService = () => createClient(BASE_URL, TIMEOUT);
export const getAPISessionService = () => api;
export const getAPISessionService2 = () => attachSessionInterceptor(createClient(BASE_URL2, TIMEOUT));
export const getAPIServiceBamApp = () => createClient(BASE_URL3, TIMEOUT);

attachDebugInterceptors(api);

export default api;
