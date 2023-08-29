import axios, {AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, isAxiosError} from 'axios';
import {eraseUserTokens, setIsRefreshing, setUserTokens} from '@redux/sessionSlice';
import store from '@redux/store';
import * as SessionService from './SessionService';
import Cookies from 'js-cookie';
import {Pagination} from './Types';

interface IAPIErrorResponse {
  message: string;
}

interface  IAPISuccessResponse {
  message: string;
}

const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    'Content-type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const access_token = Cookies.get('AccessToken') || '';
    config.headers.Authorization = `Bearer ${access_token}`;
    return config;
  },
  (error: AxiosError) => {
    console.log(`[API] ${error.config?.method} ${error.config?.url} [Error]`);

    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[API] ${response.config.method} ${response.config.url} [${response.status}]`);

    return Promise.resolve(response);
  },
  async (error: AxiosError<IAPIErrorResponse>) => {
    console.log(`[API] ${error.config?.method} ${error.config?.url} [${error.response?.status}]`);

    if (error.response && error.response.status === 401 && !store.getState().session.isRefreshing) {
      console.log('refreshing tokens...');

      const access_token = Cookies.get('AccessToken');
      const refresh_token = Cookies.get('RefreshToken');

      console.log('Access token: ' + access_token);
      console.log('refresh_token: ' + refresh_token);

      if (access_token && refresh_token) {
        try {
          store.dispatch(setIsRefreshing(true));
          const tokens = await SessionService.refreshTokensAsync({access_token, refresh_token});
          console.log('refreshing tokens [error]', tokens);
          store.dispatch(setUserTokens(tokens));
        } catch(error) {
          if (isAxiosError(error) && error.response?.status == 422) {
            store.dispatch(eraseUserTokens());
          }

          return Promise.reject(error);
        } finally {
          store.dispatch(setIsRefreshing(false));
        }

        if (error.config) {
          return axios.request(error.config);
        }
      } else {
        store.dispatch(eraseUserTokens());
      }
    }

    // Debug
    if (error.response) {
      console.log(error.response.data.message);
    } else {
      console.log(error.message);
    }

    return Promise.reject(error);
  }
);

export async function _gets<DataType=any>(url: string, config?: AxiosRequestConfig) {
  const response = await axiosInstance.get<Array<DataType>>(url, config);

  const pagination: Pagination<DataType> = {
    data: response.data,
    paginate: {
      page: response.headers['Pagination-Page'],
      per_page: response.headers['Pagination-Per-Page'],
      total_pages: response.headers['Pagination-Total-Pages'],
      total_objects: response.headers['Pagination-Total-Objects']
    }
  };

  return pagination;
}

export async function _get<DataType=any>(url: string, config?: AxiosRequestConfig) {
  const response = await axiosInstance.get<DataType>(url, config);
  return response.data;
}

export async function _post<DataType=IAPISuccessResponse>(url: string, data?: any, config?: AxiosRequestConfig) {
  const response = await axiosInstance.post<DataType>(url, data, config);
  return response.data;
}

export async function _put<DataType=IAPISuccessResponse>(url: string, data?: any, config?: AxiosRequestConfig) {
  const response = await axiosInstance.put<DataType>(url, data, config);
  return response.data;
}

export async function _delete<DataType=IAPISuccessResponse>(url: string, config?: AxiosRequestConfig) {
  const response = await axiosInstance.delete<DataType>(url, config);
  return response.data;
}

export default {
  _gets,
  _get,
  _post,
  _put,
  _delete
};