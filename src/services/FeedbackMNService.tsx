import ApiService from './ApiService';

export const getAllAsync = (params: {page?: number, per_page?: number, query?: string, from_date?: Date, to_date?: Date}) => {
    return ApiService.get('/admin/feedbacks', {params});
};
