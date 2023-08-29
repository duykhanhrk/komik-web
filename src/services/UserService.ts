import ApiService from './ApiService';
import {User} from './Types';

export const getProfile = () => ApiService._get<User>('/app/user');

export const updateInfo = (user: { lastname: string, firstname: string, birthday: Date }) => {
  return ApiService._put('/app/user', { user });
};

export const updateAccount = (user: { username?: string, email?: string, password: string, new_password?: string }) => {
  return ApiService._put('/app/user/change_login_info', { user });
};

export const updateAvatar = async (avatar: File) => {
  const formData = new FormData();
  formData.append('avatar', avatar);

  return ApiService._put('/app/user/upload_avatar', formData, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  });
};
