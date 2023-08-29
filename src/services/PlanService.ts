import ApiService from './ApiService';
import {Plan} from './Types';

export const getAllAsync = () => ApiService._get<Array<Plan>>('/app/plans');
