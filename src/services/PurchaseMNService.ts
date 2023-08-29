import ApiService from './ApiService';
import {Purchase} from './Types';

export const getAllAsync = (params: {page?: number, per_page?: number}) => {
  return ApiService._gets<Purchase>('/admin/purchases', {params: {per_page: 20, ...params}});
};
