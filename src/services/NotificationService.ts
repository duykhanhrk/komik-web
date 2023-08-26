import ApiService from './ApiService';

export const getAllAsync = (params: {page?: number, per_page?: number}) => {
    return ApiService.get('/app/notifications', {params: {per_page: 20, ...params}});
};
