import ApiService from './ApiService';

export const getAllPaymentMethods = () => [{ key: 'card', name: 'Master/Visa' }];

export const getStripeKeyAsync = () => {
  return ApiService.get('/app/purchases/stripe_key');
}

export const getAllAsync = (params: {page?: number, per_page?: number}) => {
  return ApiService.get('/app/purchases', {params: {per_page: 20, ...params}});
}

export const paymentByCardAsync = (params: { plan_id: number, token: string }) => {
  return ApiService.post(`/app/purchases/card`, { purchase: params });
}
