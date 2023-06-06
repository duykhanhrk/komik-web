import ApiService from './ApiService';
import {Category} from './Types';

export const getAllAsync = (params: {page?: number, per_page?: number, sort_by?:string, query?: string}) => {
  return ApiService.get('/admin/categories', {params});
}

export const createAsync = (category: Category) => ApiService.post(`/admin/categories`, {category});

export const updateAsync = (category: Category) => ApiService.put(`/admin/categories/${category.id}`, {category});

export const deleteAsync = (id: number) => ApiService.delete(`/admin/categories/${id}`);

export const getStatisticsAsync = () => ApiService.get('/admin/categories/statistics');
