import axios, { AxiosError, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

export interface APIResponseType<T> {
  isSuccess: boolean;
  isFailure: boolean;
  data: T | null;
  message?: string 
}

export const checkResponseStatus = (statusCode: number) => {
  if (statusCode !== 200 && statusCode !== 201) {
    throw new AxiosError();
  }
};

export const instance = axios.create({
  withCredentials: true,
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
