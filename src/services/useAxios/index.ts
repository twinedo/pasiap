// import {ADMIN_SECRET} from '@env';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_MAIN} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
// import {IUserJWT, ServerError} from 'types/interfaces';
// import decode from 'jwt-decode';
// import authStore from 'store/authStore';

const instance = axios;

// Interceptor function
instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    var token = await AsyncStorage.getItem('@pasiap_access_token');
    // var token =
    //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3JvbGUiOiJPcGVyYXRvciIsImF1ZCI6WyJhbGxzdG9yZSJdLCJjb21wYW55X2lkIjoiVEstVFJTQ01QLTIwMTkxMDA5MTgzNDUwMDAwMDAwMSIsInVzZXJfaWQiOiJUSy1UUlNVU1ItMjAxOTEwMDkxOTAwMTAwMDAwMDA1IiwidXNlcl9uYW1lIjoiaGFsc2V5LmdyYW5kZUBnbWFpbC5jb20iLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXSwiY29tcGFueV9uYW1lIjoiUFQuIEZhbGxpbiBVbml0ZWQiLCJleHAiOjE1ODY0MTE3ODIsImF1dGhvcml0aWVzIjpbIlRyYW5zcG9ydGVyIl0sImp0aSI6IjUwMjhjYjExLTJmMzMtNDY2ZC04MjcwLTBhNjU2MzI1NDk4ZiIsImNsaWVudF9pZCI6InRydWNraW5nY2xpZW50In0.HHgCLYM8J1CywoM09A7i2ur1vL7zLMmLAxHbE1aEsQI';
    await instance
      .post(`${API_MAIN}/refresh`, {token})
      .then(resRefresh => {
        console.log('resRefresh', resRefresh);
      })
      .catch(err => {
        console.error('error refresh', err);
      });
    config!.headers!.Authorization! = `Bearer ${token}`;
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

interface configProps {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  params?: object;
  data?: any;
  headers?: any;
  cancelToken?: any;
  isAuth?: boolean;
}

export const useAxios = async (props: configProps) => {
  const {url, method, params, data, headers, cancelToken} = props;

  try {
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
