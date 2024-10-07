import { instance } from "@/app/utils/http";
import { AxiosRequestConfig } from "axios";
import { type  Fetcher } from "swr";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const defaultFetcher: Fetcher<any, string> = (url) => {
  instance.get(url).then((res)=>res.data)
};

export const postFetcher = async<RequestBody, Response>(
  key: string | string[],
  { arg }: { arg: RequestBody },
  options?: AxiosRequestConfig<RequestBody>,
) => {
  const url = Array.isArray(key) ? key.join('/') : key;
  try {
    const response = await instance.post<Response>(url, arg, options);
    return response.data;
  } catch (error){
    throw error;
  }
}

export const deleteFetcher = async(key: string | string[]) => {
  const url = Array.isArray(key) ? key.join('/') : key;
  try {
    await instance.delete(url);
  } catch (error) {
    throw error;
  }
}

export const patchFetcher = async<T>(key: string[], { arg }: { arg: T }) => {
  const url = key.join('/');
  try {
    await instance.patch(url, arg);
  } catch (error) {
    throw error;
  }
}
