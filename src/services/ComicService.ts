import ApiService from './ApiService';

export const getAllAsync = (params: {page?: number, per_page?: number, category_ids?: string, sort_by?:string}) => {
  return ApiService.get('/app/comics', {params: {per_page: 20, sort_by: 'updated_at-desc', ...params}});
}

export const getDetailAsync = (id: number) => ApiService.get(`/app/comics/${id}`);

export const getLikedAsync = (params: {page?: number, per_page?: number}) => {
  return ApiService.get('/app/comics/liked', {params: {per_page: 20, ...params}});
}

export const getFollowedAsync = (params: {page?: number, per_page?: number}) => {
  return ApiService.get('/app/comics/followed', {params: {per_page: 20, ...params}});
}

export const likeAsync = (id: number, like: boolean) => {
  return like ? ApiService.post(`/app/comics/${id}/like`) : ApiService.post(`/app/comics/${id}/unlike`);
}

export const followAsync = (id: number, follow: boolean) => {
  return follow ? ApiService.post(`/app/comics/${id}/follow`) : ApiService.post(`/app/comics/${id}/unfollow`);
}
