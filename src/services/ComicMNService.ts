import ApiService from './ApiService';
import {Chapter, Comic, Review} from './Types';

export const getAllAsync = (params: {page?: number, per_page?: number, sort_by?:string, query?: string}) => {
  return ApiService._gets<Comic>('/admin/comics', {params: {...params, sort_by: 'created_at-desc'}});
};

export const getDetailAsync = (id: number | string) => ApiService._get<Comic>(`/admin/comics/${id}`);

export const createAsync = (comic: Comic) => ApiService._post('/admin/comics', {comic});

export const updateAsync = (comic: Comic) => ApiService._put(`/admin/comics/${comic.id}`, {comic});

export const deleteAsync = (id: number | string) => ApiService._delete(`/admin/comics/${id}`);

export const activeAsync = (id: number | string, active: boolean) => ApiService._put(`/admin/comics/${id}`, {active});

export const updateImageAsync = async (id: number | string, image: File) => {
  const formData = new FormData();
  formData.append('image', image);

  return ApiService._put(`/admin/comics/${id}/upload_image`, formData, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getAllChaptersAsync = (comic_id: number | string, params: {page?: number, per_page?: number, query?: string}) => {
  return ApiService._gets<Chapter>(`/admin/comics/${comic_id}/chapters`, {params});
};

export const createChapterAsync = (comic_id: number | string, chapter: Chapter) => ApiService._post(`/admin/comics/${comic_id}/chapters`, {chapter});

export const updateChapterAsync = (comic_id: number | string, chapter: Chapter) => ApiService._put(`/admin/comics/${comic_id}/chapters/${chapter.id}`, {chapter});

export const deleteChapterAsync = (comic_id: number | string, id: number | string) => ApiService._delete(`/admin/comics/${comic_id}/chapters/${id}`);

export const updateChapterImagesAsync = async (comic_id: number | string, id: number | string, images: Array<File>) => {
  const formData = new FormData();
  for (const image of images) {
    formData.append('images[]', image);
  }

  return ApiService._put(`/admin/comics/${comic_id}/chapters/${id}/upload_images`, formData, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const getAllReviewsAsync = (comic_id: number | string, params: {page?: number, per_page?: number, query?: string}) => {
  return ApiService._gets<Review>(`/admin/comics/${comic_id}/reviews`, {params});
};

export const deleteReviewAsync = (comic_id: number | string, id: number) => ApiService._delete(`/admin/comics/${comic_id}/reviews/${id}`);
