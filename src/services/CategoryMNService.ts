import ApiService from './ApiService';
import {Category} from './Types';

export const getAllAsync = (params: {page?: number, per_page?: number, sort_by?:string, query?: string}) => {
  return ApiService._gets<Category>('/admin/categories', {params});
};

export const createAsync = (category: Category) => ApiService._post('/admin/categories', {category});

export const updateAsync = (category: Category) => ApiService._put(`/admin/categories/${category.id}`, {category});

export const deleteAsync = (id: number) => ApiService._delete(`/admin/categories/${id}`);

export const getStatisticsAsync = () => ApiService._get('/admin/categories/statistics');
