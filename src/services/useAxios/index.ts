// import {ADMIN_SECRET} from '@env';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_MAIN} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import {fetchAPI} from 'services/fetch';
// import {IUserJWT, ServerError} from 'types/interfaces';
// import decode from 'jwt-decode';
// import authStore from 'store/authStore';

interface configProps {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  params?: object;
  data?: any;
  headers?: any;
  cancelToken?: any;
  isAuth?: boolean;
}

const instance = axios.create();

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Function to add a new subscriber to be notified when the token is refreshed
function subscribeToTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// Function to notify all subscribers when the token is refreshed
function notifySubscribers(token: string) {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
}

// Interceptor function
const applyInterceptor = instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('@pasiap_access_token');
      // console.log('token interceptor', token);
      // const refreshResponse = await fetchAPI({
      //   url: `${API_MAIN}/refresh`,
      //   method: 'post',
      //   data: {
      //     token,
      //   },
      // });
      // console.log('reffresh res', refreshResponse);
      // var token =
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3JvbGUiOiJPcGVyYXRvciIsImF1ZCI6WyJhbGxzdG9yZSJdLCJjb21wYW55X2lkIjoiVEstVFJTQ01QLTIwMTkxMDA5MTgzNDUwMDAwMDAwMSIsInVzZXJfaWQiOiJUSy1UUlNVU1ItMjAxOTEwMDkxOTAwMTAwMDAwMDA1IiwidXNlcl9uYW1lIjoiaGFsc2V5LmdyYW5kZUBnbWFpbC5jb20iLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXSwiY29tcGFueV9uYW1lIjoiUFQuIEZhbGxpbiBVbml0ZWQiLCJleHAiOjE1ODY0MTE3ODIsImF1dGhvcml0aWVzIjpbIlRyYW5zcG9ydGVyIl0sImp0aSI6IjUwMjhjYjExLTJmMzMtNDY2ZC04MjcwLTBhNjU2MzI1NDk4ZiIsImNsaWVudF9pZCI6InRydWNraW5nY2xpZW50In0.HHgCLYM8J1CywoM09A7i2ur1vL7zLMmLAxHbE1aEsQI';
      // if (refreshResponse?.status === 200) {
      //   config.headers.Authorization = `Bearer ${refreshResponse?.data?.token}`;
      //   AsyncStorage.setItem(
      //     '@pasiap_access_token',
      //     refreshResponse?.data?.token,
      //   );
      // } else {
      config.headers.Authorization = `Bearer ${token}`;
      // }
    } catch (error) {
      console.error('Error in token refresh:', error);
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

// instance.interceptors.response.use(
//   async (response: AxiosResponse) => {
//     return response;
//   },
//   async (error: AxiosError) => {
//     if (
//       axios.isAxiosError(error) &&
//       error.response &&
//       error.response.status === 401
//     ) {
//       try {
//         const token = await AsyncStorage.getItem('@pasiap_access_token');
//         console.log('token interceptor', token);
//         const refreshResponse = await fetchAPI({
//           url: `${API_MAIN}/refresh`,
//           method: 'post',
//           data: {
//             token,
//           },
//         });
//         console.log('reffresh res', refreshResponse);
//         // var token =
//         //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3JvbGUiOiJPcGVyYXRvciIsImF1ZCI6WyJhbGxzdG9yZSJdLCJjb21wYW55X2lkIjoiVEstVFJTQ01QLTIwMTkxMDA5MTgzNDUwMDAwMDAwMSIsInVzZXJfaWQiOiJUSy1UUlNVU1ItMjAxOTEwMDkxOTAwMTAwMDAwMDA1IiwidXNlcl9uYW1lIjoiaGFsc2V5LmdyYW5kZUBnbWFpbC5jb20iLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXSwiY29tcGFueV9uYW1lIjoiUFQuIEZhbGxpbiBVbml0ZWQiLCJleHAiOjE1ODY0MTE3ODIsImF1dGhvcml0aWVzIjpbIlRyYW5zcG9ydGVyIl0sImp0aSI6IjUwMjhjYjExLTJmMzMtNDY2ZC04MjcwLTBhNjU2MzI1NDk4ZiIsImNsaWVudF9pZCI6InRydWNraW5nY2xpZW50In0.HHgCLYM8J1CywoM09A7i2ur1vL7zLMmLAxHbE1aEsQI';
//         AsyncStorage.setItem(
//           '@pasiap_access_token',
//           refreshResponse?.data?.token,
//         );
//       } catch (err) {
//         console.error('Error in token refresh res2:', err);
//       }
//     }
//   },
// );

export const useAxios = async (props: configProps) => {
  const {
    url,
    method,
    params,
    data,
    headers,
    cancelToken,
    isAuth = true,
  } = props;

  try {
    if (isAuth) {
      // If authentication is required, apply the interceptor
      applyInterceptor;
    }
    const response: AxiosResponse = await instance({
      url,
      method,
      params,
      data,
      cancelToken,
      headers,
    });

    return Promise.resolve(response);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const serverError = err as AxiosError<any>;
      if (serverError && serverError.response) {
        return Promise.reject(serverError.response);
      }
    } else {
      throw new Error('different error than axios');
    }
  }
};

export default instance;
