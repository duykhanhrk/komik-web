import ApiService from './ApiService';
import {Purchase} from './Types';

export const getAllPaymentMethods = () => [{ key: 'card', name: 'Master/Visa' }];

export const getStripeKeyAsync = () => {
  return ApiService._get('/app/purchases/stripe_key');
};

export const getAllAsync = (params: {page?: number, per_page?: number}) => {
  return ApiService._gets<Purchase>('/app/purchases', {params: {per_page: 20, ...params}});
};

export const paymentByCardAsync = (params: { plan_id: number, token: string }) => {
  return ApiService._post('/app/purchases/card', { purchase: params });
};
