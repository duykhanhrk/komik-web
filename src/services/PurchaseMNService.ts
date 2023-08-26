import ApiService from './ApiService';

export const getAllAsync = (params: {page?: number, per_page?: number}) => {
    return ApiService.get('/admin/purchases', {params: {per_page: 20, ...params}});
};
