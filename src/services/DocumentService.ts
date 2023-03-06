import ApiService from './ApiService';

export const getPolicyAndTermsAsync = () => ApiService.get(`/app/documents/policy_and_terms`);

export const getIntroductionAsync = () => ApiService.get(`/app/documents/introduction`);
