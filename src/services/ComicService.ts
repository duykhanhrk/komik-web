import ApiService from './ApiService';
import { Comment } from './Types';

export const getAllAsync = (params: {page?: number, per_page?: number, category_ids?: string, sort_by?:string, query?: string}) => {
  return ApiService.get('/app/comics', {params: {per_page: 20, sort_by: 'last_updated_chapter_at-desc', ...params}});
}

export const getDetailAsync = (id: number) => ApiService.get(`/app/comics/${id}`);

export const getLikedAsync = (params: {page?: number, per_page?: number}) => {
  return ApiService.get('/app/comics/liked', {params: {per_page: 20, ...params}});
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

export const likeAsync = (id: number, like: boolean) => {
  return like ? ApiService.post(`/app/comics/${id}/like`) : ApiService.post(`/app/comics/${id}/unlike`);
}

export const followAsync = (id: number, follow: boolean) => {
  return follow ? ApiService.post(`/app/comics/${id}/follow`) : ApiService.post(`/app/comics/${id}/unfollow`);
}

export const getCommentsAsync = (id: number, params: {page?: number, per_page?: number}) => {
  return ApiService.get(`/app/comics/${id}/comments`, {params: {per_page: 20, ...params}});
}

export const getUserCommentAsync = (id: number) => ApiService.get(`/app/comics/${id}/comments/user_comment`);

export const createCommentAsync = (comic_id: number, comment: Comment) => ApiService.post(`/app/comics/${comic_id}/comments`, {comment});

export const updateCommentAsync = (comic_id: number, comment: Comment) => ApiService.put(`/app/comics/${comic_id}/comments/${comment.id}`, {comment});

export const deleteCommentAsync = (comic_id: number, comment_id: number) => ApiService.delete(`/app/comics/${comic_id}/comments/${comment_id}`);
