import ApiService from './ApiService';
import {Author} from './Types';

export const getAllAsync = (params: {page?: number, per_page?: number, sort_by?:string, query?: string}) => {
  return ApiService._gets<Author>('/admin/authors', {params});
};

export const getDetailAsync = (id: number) => ApiService._get<Author>(`/admin/authors/${id}`);

export const createAsync = (author: Author) => ApiService._post('/admin/authors', {author});

export const updateAsync = (author: Author) => ApiService._put(`/admin/authors/${author.id}`, {author});

export const deleteAsync = (id: number) => ApiService._delete(`/admin/authors/${id}`);

export const getStatisticsAsync = () => ApiService._get('/admin/authors/statistics');

export const updateImageAsync = async (id: number, image: File) => {
  const formData = new FormData();
  formData.append('image', image);

  return ApiService._put(`/admin/authors/${id}/upload_image`, formData, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  });
};
