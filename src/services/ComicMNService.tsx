import ApiService from './ApiService';
import {Chapter, Comic} from './Types';

export const getAllAsync = (params: {page?: number, per_page?: number, sort_by?:string, query?: string}) => {
    return ApiService.get('/admin/comics', {params: {...params, sort_by: 'created_at-desc'}});
};

export const getDetailAsync = (id: number) => ApiService.get(`/admin/comics/${id}`);

export const createAsync = (comic: Comic) => ApiService.post('/admin/comics', {comic});

export const updateAsync = (comic: Comic) => ApiService.put(`/admin/comics/${comic.id}`, {comic});

export const deleteAsync = (id: number) => ApiService.delete(`/admin/comics/${id}`);

export const activeAsync = (id: number, active: boolean) => ApiService.put(`/admin/comics/${id}`, {active});

export const updateImageAsync = async (id: number, image: File) => {
    const formData = new FormData();
    formData.append('image', image);

    return ApiService.put(`/admin/comics/${id}/upload_image`, formData, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getAllChaptersAsync = (comic_id: number, params: {page?: number, per_page?: number, query?: string}) => {
    return ApiService.get(`/admin/comics/${comic_id}/chapters`, {params});
};

export const createChapterAsync = (comic_id: number, chapter: Chapter) => ApiService.post(`/admin/comics/${comic_id}/chapters`, {chapter});

export const updateChapterAsync = (comic_id: number, chapter: Chapter) => ApiService.put(`/admin/comics/${comic_id}/chapters/${chapter.id}`, {chapter});

export const deleteChapterAsync = (comic_id: number, id: number) => ApiService.delete(`/admin/comics/${comic_id}/chapters/${id}`);

export const updateChapterImagesAsync = async (comic_id: number, id: number, images: Array<File>) => {
    const formData = new FormData();
    for (const image of images) {
        formData.append('images[]', image);
    }

    return ApiService.put(`/admin/comics/${comic_id}/chapters/${id}/upload_images`, formData, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getAllReviewsAsync = (comic_id: number, params: {page?: number, per_page?: number, query?: string}) => {
    return ApiService.get(`/admin/comics/${comic_id}/reviews`, {params});
};

export const deleteReviewAsync = (comic_id: number, id: number) => ApiService.delete(`/admin/comics/${comic_id}/reviews/${id}`);
