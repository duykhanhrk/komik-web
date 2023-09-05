import ApiService from './ApiService';
import {Chapter, Comic, Review} from './Types';

export const getAllAsync = (params: {page?: number, per_page?: number, category_ids?: string, release_dates?: string, sort_by?:string, query?: string}) => {
  return ApiService._gets<Comic>('/app/comics', {params: {per_page: 20, sort_by: 'last_updated_chapter_at-desc', ...params}});
};

export const getDetailAsync = (slug: string) => ApiService._get<Comic>(`/app/comics/${slug}`);

export const getFavoritedAsync = (params: {page?: number, per_page?: number}) => {
  return ApiService._gets<Comic>('/app/comics/favorited', {params: {per_page: 20, ...params}});
};

export const getFollowedAsync = (params: {page?: number, per_page?: number}) => {
  return ApiService._gets<Comic>('/app/comics/followed', {params: {per_page: 20, ...params}});
};

export const getUpComingAsync = (params: {page?: number, per_page?: number}) => {
  return ApiService._gets<Comic>('/app/comics/up_coming', {params: {per_page: 20, ...params}});
};

export const getReadAsync = (params: {page?: number, per_page?: number}) => {
  return ApiService._gets<Comic>('/app/comics/read', {params: {per_page: 20, ...params}});
};

export const favoriteAsync = (id: number | string, like: boolean) => {
  return like ? ApiService._post(`/app/comics/${id}/favorite`) : ApiService._post(`/app/comics/${id}/unfavorite`);
};

export const followAsync = (slug: string, follow: boolean) => {
  return follow ? ApiService._post(`/app/comics/${slug}/follow`) : ApiService._post(`/app/comics/${slug}/unfollow`);
};

export const getChaptersAsync = (comic_slug: string, params: {page?: number, per_page?: number}) => {
  return ApiService._gets<Chapter>(`/app/comics/${comic_slug}/chapters`, {params: {per_page: 20, ...params}});
};

export const getChapterDetailAsync = (comic_slug: string, id: number) => {
  return ApiService._get<Chapter>(`/app/comics/${comic_slug}/chapters/${id}`);
};

export const getReviewsAsync = (comic_slug: string, params: {page?: number, per_page?: number}) => {
  return ApiService._gets<Review>(`/app/comics/${comic_slug}/reviews`, {params: {per_page: 20, ...params}});
};

export const getUserReviewAsync = (comic_slug: string) => ApiService._get(`/app/comics/${comic_slug}/reviews/user_review`);

export const createReviewAsync = (comic_slug: string, review: Review) => ApiService._post(`/app/comics/${comic_slug}/reviews`, {review});

export const updateReviewAsync = (comic_slug: string, review: Review) => ApiService._put(`/app/comics/${comic_slug}/reviews/${review.id}`, {review});

export const deleteReviewAsync = (comic_slug: string, review_id: number) => ApiService._delete(`/app/comics/${comic_slug}/reviews/${review_id}`);

export const evaluateReviewAsync = (comic_slug: string, review_id: number, point_of_view: number) => ApiService._post(`/app/comics/${comic_slug}/reviews/${review_id}/evaluate`, {evaluate: {point_of_view}});
