import ApiService from './ApiService';
import {Plan} from './Types';

export const getAllAsync = (params: {page?: number, per_page?: number, query?: string}) => {
  return ApiService.get('/admin/plans', {params});
}

export const createAsync = (plan: Plan) => ApiService.post(`/admin/plans`, {plan});

export const updateAsync = (plan: Plan) => ApiService.put(`/admin/plans/${plan.id}`, {plan});

export const deleteAsync = (id: number) => ApiService.delete(`/admin/plans/${id}`);

export const getStatisticsBySubscriptionsAsync = (stat_object?: 'subscriptions' | 'revenue', year?: number, month?: number) => ApiService.get(`/admin/plans/statistics_by_subscriptions`, {params: {month, year, stat_object}});
