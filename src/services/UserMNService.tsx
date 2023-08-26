import ApiService from './ApiService';
import {User} from './Types';

export const getAllAsync = (params: {page?: number, per_page?: number, sort_by?:string, query?: string}) => {
    return ApiService.get('/admin/users', {params});
};

export const createAsync = (user: User, auth_password: string) => ApiService.post('/admin/users', {user: {...user, auth_password}});

export const updateAsync = (user: User, auth_password: string) => ApiService.put(`/admin/users/${user.username}`, {user: {...user, auth_password}});
