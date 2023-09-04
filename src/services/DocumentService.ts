import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    'Content-type': 'application/json'
  }
});

export async function getPolicyAndTermsAsync() {
  const response = await axiosInstance.get('/app/documents/policy_and_terms');

  return response.data;
}

export async function getIntroductionAsync() {
  const response = await axiosInstance.get('/app/documents/introduction');

  return response.data;
}
