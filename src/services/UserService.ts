import ApiService from './ApiService';

export const getProfile = () => ApiService.get('/app/user');

export const updateInfo = (user: { lastname: string, firstname: string, birthday: Date }) => {
  return ApiService.put('/app/user', { user });
}

export const updateAccount = (user: { username?: string, email?: string, password: string, new_password?: string }) => {
  return ApiService.put('/app/user/change_login_info', { user });
}

export const updateAvatar = async (avatar: File) => {
  const formData = new FormData();
  formData.append('avatar', avatar);

  return ApiService.put('/app/user/upload_avatar', formData, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  });
}
