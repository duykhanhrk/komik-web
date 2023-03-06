import axios from 'axios';
import { SignUpForm, SignInForm, UserTokens } from '@services';

const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    'Content-type': 'application/json'
  }
});

export async function signUpAsync(signUpForm: SignUpForm, exponentToken?: string) {
  const response = await axiosInstance.post('/auth/sign_up', signUpForm, {
    headers: {
      'Exponent-Token': exponentToken
    }
  });

  return response.data.data;
}

export async function signInAsync(signInFrom: SignInForm, exponentToken?: string) {
  const response = await axiosInstance.post('/auth/sign_in', signInFrom, {
    headers: {
      'Exponent-Token': exponentToken
    }
  });

  return response.data.data;
}

export async function signOutAsync(userTokens: UserTokens) {
  await axiosInstance.post('/auth/sign_out', {}, {
    headers: {
      'Authorization': `Bearer ${userTokens.access_token}`,
      'Refresh-Token': userTokens.refresh_token
    }
  });

  return { access_token: null, refresh_token: null };
}

export async function sendVerificationCode(email: string) {
  const response = await axiosInstance.post('/auth/send_verification_code', {email});

  return response.data.data;
}

export async function resetPassword(email: string, verification_code: string, password: string) {
  const response = await axiosInstance.post('/auth/reset_password', {email, verification_code, password});

  return response.data.data;
}

export async function refreshTokensAsync(userTokens: UserTokens) {
  console.log('Refreshing...');

  const response = await axiosInstance.post('/auth/refresh', {}, {
    headers: {
      'Authorization': `Bearer ${userTokens.access_token}`,
      'Refresh-Token': userTokens.refresh_token
    }
  });

  return response.data.data;
}
