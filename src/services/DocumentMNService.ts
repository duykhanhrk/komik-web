import ApiService from './ApiService';

export const getIntroductionAsync = () => ApiService._get('/admin/documents/introduction');
export const getPolicyAndTermsAsync = () => ApiService._get('/admin/documents/policy_and_terms');

export const updateIntroductionAsync = (document: {key: string, value: string}) => ApiService._put('/admin/documents/introduction', document);
export const updatePolicyAndTermsAsync = (document: {key: string, value: string}) => ApiService._put('/admin/documents/policy_and_terms', document);
