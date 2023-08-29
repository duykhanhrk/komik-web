import ApiService from './ApiService';

export const getSuggestKeywordsAsync = (query: string) => ApiService._get('/app/searchings/suggest_keywords', {params: {query}});
