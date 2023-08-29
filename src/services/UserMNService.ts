import ApiService from './ApiService';
import {User} from './Types';

export const getAllAsync = (params: {page?: number, per_page?: number, sort_by?:string, query?: string}) => {
  return ApiService._gets<User>('/admin/users', {params});
};

export const createAsync = (user: User, auth_password: string) => ApiService._post('/admin/users', {user: {...user, auth_password}});

export const updateAsync = (user: User, auth_password: string) => ApiService._put(`/admin/users/${user.username}`, {user: {...user, auth_password}});
