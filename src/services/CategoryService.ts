import ApiService from './ApiService';

export const getAllAsync = () => ApiService.get('/app/categories');
