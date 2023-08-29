import {SessionService} from '@services';
import * as React from 'react';
import useAppDispatch from './useAppDispatch';
import { eraseUserTokens, setUserTokens } from '@redux/sessionSlice';
import {isAxiosError} from 'axios';
import Cookies from 'js-cookie';

export default function useTryLogin() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);

  const dispatch = useAppDispatch();

  const tryLogin = async () => {
    console.log('try login');
    setIsLoading(true);
    setIsError(false);
    try {
      const refresh_token = Cookies.get('RefreshToken');
      const access_token = Cookies.get('AccessToken');

      if (refresh_token && access_token) {
        const response = await SessionService.refreshTokensAsync({access_token, refresh_token});

        dispatch(setUserTokens(response));
      }
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status == 422) {
          dispatch(eraseUserTokens);
        } else {
          setIsError(true);
        }
      } else {
        setIsError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => { tryLogin(); }, []);

  return { isLoading, isError, tryLogin };
}
