import ApiService from './ApiService';

export const sendFeedbackAsync = (feedback: {title: string, content: string}) => {
  return ApiService._post('/app/feedbacks', feedback);
};
