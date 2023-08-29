import ApiService from './ApiService';
import {Plan} from './Types';

export const getAllAsync = (params: {page?: number, per_page?: number, query?: string}) => {
  return ApiService._gets<Plan>('/admin/plans', {params});
};

export const createAsync = (plan: Plan) => ApiService._post('/admin/plans', {plan});

export const updateAsync = (plan: Plan) => ApiService._put(`/admin/plans/${plan.id}`, {plan});

export const deleteAsync = (id: number) => ApiService._delete(`/admin/plans/${id}`);

export const getStatisticsBySubscriptionsAsync = (stat_object?: 'subscriptions' | 'revenue', year?: number, month?: number) => ApiService._get('/admin/plans/statistics_by_subscriptions', {params: {month, year, stat_object}});
