import ApiService from './ApiService';

export const getSuggestKeywordsAsync = (query: string) => ApiService.get('/app/searchings/suggest_keywords', {params: {query}});
