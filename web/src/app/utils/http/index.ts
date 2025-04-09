import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

export interface APIResponseType<T> {
  isSuccess: boolean;
  isFailure: boolean;
  data: T | null;
  message?: string 
}

export const checkResponseStatus = (statusCode: number) => {
  if (statusCode !== 200 && statusCode !== 201) {
    throw new Error();
  }
};

export const instance = axios.create({
  withCredentials: true,
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

instance.interceptors.response.use((response: AxiosResponse) => {
  return response;
});

instance.interceptors.request.use(
  function (config) {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);
