import ApiService from './ApiService';

export const getDetailAsync = (id: number) => ApiService.get(`/app/chapters/${id}`);
