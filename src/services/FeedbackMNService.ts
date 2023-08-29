import ApiService from './ApiService';
import {Feedback} from './Types';

export const getAllAsync = (params: {page?: number, per_page?: number, query?: string, from_date?: Date, to_date?: Date}) => {
  return ApiService._gets<Feedback>('/admin/feedbacks', {params});
};
