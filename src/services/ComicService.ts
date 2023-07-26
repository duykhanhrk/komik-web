import ApiService from './ApiService';
import { Review } from './Types';

export const getAllAsync = (params: {page?: number, per_page?: number, category_ids?: string, release_dates?: string, sort_by?:string, query?: string}) => {
  return ApiService.get('/app/comics', {params: {per_page: 20, sort_by: 'last_updated_chapter_at-desc', ...params}});
}

export const getDetailAsync = (id: number) => ApiService.get(`/app/comics/${id}`);

export const getFavoritedAsync = (params: {page?: number, per_page?: number}) => {
  return ApiService.get('/app/comics/favorited', {params: {per_page: 20, ...params}});
}

export const getFollowedAsync = (params: {page?: number, per_page?: number}) => {
  return ApiService.get('/app/comics/followed', {params: {per_page: 20, ...params}});
}

export const getUpComingAsync = (params: {page?: number, per_page?: number}) => {
  return ApiService.get('/app/comics/up_coming', {params: {per_page: 20, ...params}});
}

export const getReadAsync = (params: {page?: number, per_page?: number}) => {
  return ApiService.get('/app/comics/read', {params: {per_page: 20, ...params}});
}

export const favoriteAsync = (id: number, like: boolean) => {
  return like ? ApiService.post(`/app/comics/${id}/favorite`) : ApiService.post(`/app/comics/${id}/unfavorite`);
}

export const followAsync = (id: number, follow: boolean) => {
  return follow ? ApiService.post(`/app/comics/${id}/follow`) : ApiService.post(`/app/comics/${id}/unfollow`);
}

export const getChaptersAsync = (comic_id: number, params: {page?: number, per_page?: number}) => {
  return ApiService.get(`/app/comics/${comic_id}/chapters`, {params: {per_page: 20, ...params}});
}

export const getChapterDetailAsync = (comic_id: number, id: number) => {
  return ApiService.get(`/app/comics/${comic_id}/chapters/${id}`);
}

export const getReviewsAsync = (id: number, params: {page?: number, per_page?: number}) => {
  return ApiService.get(`/app/comics/${id}/reviews`, {params: {per_page: 20, ...params}});
}

export const getUserReviewAsync = (id: number) => ApiService.get(`/app/comics/${id}/reviews/user_review`);

export const createReviewAsync = (comic_id: number, review: Review) => ApiService.post(`/app/comics/${comic_id}/reviews`, {review});

export const updateReviewAsync = (comic_id: number, review: Review) => ApiService.put(`/app/comics/${comic_id}/reviews/${review.id}`, {review});

export const deleteReviewAsync = (comic_id: number, review_id: number) => ApiService.delete(`/app/comics/${comic_id}/reviews/${review_id}`);

export const evaluateReviewAsync = (comic_id: number, review_id: number, point_of_view: number) => ApiService.post(`/app/comics/${comic_id}/reviews/${review_id}/evaluate`, {evaluate: {point_of_view}});
