import axios, {AxiosError, AxiosResponse} from 'axios';

const instance = axios;

interface configProps {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  params?: object;
  data?: any;
  headers?: any;
  cancelToken?: any;
}

export const fetchAPI = async (props: configProps) => {
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
    console.log('response', response);

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
