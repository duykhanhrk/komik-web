import ApiService from './ApiService';
import {Author} from './Types';

export const getAllAsync = (params: {page?: number, per_page?: number, sort_by?:string, query?: string}) => {
  return ApiService.get('/admin/authors', {params});
}

export const getDetailAsync = (id: number) => ApiService.get(`/admin/authors/${id}`);

export const createAsync = (author: Author) => ApiService.post(`/admin/authors`, {author});

export const updateAsync = (author: Author) => ApiService.put(`/admin/authors/${author.id}`, {author});

export const deleteAsync = (id: number) => ApiService.delete(`/admin/authors/${id}`);

export const getStatisticsAsync = () => ApiService.get('/admin/authors/statistics');

export const updateImageAsync = async (id: number, image: File) => {
  const formData = new FormData();
  formData.append('image', image);

  return ApiService.put(`/admin/authors/${id}/upload_image`, formData, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  });
}
