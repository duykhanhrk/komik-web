import ApiService from './ApiService';
import {Category} from './Types';

export const getAllAsync = () => ApiService._get<Array<Category>>('/app/categories');
