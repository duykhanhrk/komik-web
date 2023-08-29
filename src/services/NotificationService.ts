import ApiService from './ApiService';
import {Notification} from './Types';

export const getAllAsync = (params: {page?: number, per_page?: number}) => {
  return ApiService._gets<Notification>('/app/notifications', {params: {per_page: 20, ...params}});
};
