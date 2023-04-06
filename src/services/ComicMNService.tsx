import ApiService from './ApiService';
import {Comic} from './Types';

export const getAllAsync = (params: {page?: number, per_page?: number, sort_by?:string, query?: string}) => {
  return ApiService.get('/admin/comics', {params});
}

export const getDetailAsync = (id: number) => ApiService.get(`/app/comics/${id}`);

export const createAsync = (comic: Comic) => ApiService.post(`/admin/comics`, {comic});

export const updateAsync = (comic: Comic) => ApiService.put(`/admin/comics/${comic.id}`, {comic});

export const deleteAsync = (id: number) => ApiService.delete(`/admin/comics/${id}`);

export const updateImageAsync = async (id: number, image: File) => {
  const formData = new FormData();
  formData.append('image', image);

  return ApiService.put(`/admin/comics/${id}/upload_image`, formData, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  });
}
