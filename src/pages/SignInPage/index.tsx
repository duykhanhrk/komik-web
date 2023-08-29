import {Button, Card, Input, Text, View} from '@components';
import {useAppDispatch} from '@hooks';
import {setUserTokens} from '@redux/sessionSlice';
import {SessionService} from '@services';
import {isAxiosError} from 'axios';
import {useState} from 'react';
import {useNotifications} from 'reapop';
import LoadingPage from '../LoadingPage';
import {useTheme} from 'styled-components';

function SignInPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {notify} = useNotifications();

  const dispatch = useAppDispatch();
  const theme = useTheme();

  const signIn = () => {
    setIsLoading(true);

    // check input
    if (usernameOrEmail.length === 0 || password.length === 0) {
      notify({
        title: 'Đăng nhập không thành công',
        message: 'Vui lòng nhập đầy đủ thông tin',
        status: 'error'
      });

      setIsLoading(false);
      return;
    }

    SessionService.signInAsync({
      username_or_email: usernameOrEmail,
      password
    }).then((data) => {
      dispatch(setUserTokens(data));
    }).catch((error) => {
      if (isAxiosError(error)) {
        if (error.response) {
          notify({
            title: 'Đăng nhập không thành công',
            message: error.response.data.message,
            status: 'error'
          });
        } else {
          notify({
            title: 'Không thể kết nối',
            message: 'Vui lòng kiểm tra lại kết nối',
            status: 'error'
          });
        }
      } else {
        notify({
          title: 'Hệ thống đang bảo trì',
          message: 'Vui lòng lại kết nối sau',
          status: 'error'
        });
      }
    }).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <Card shadowEffect flex={1} style={{zIndex: 100}}>
      <View flex={1} style={{rowGap: 16, padding: 18, justifyContent: 'center'}}>
        {isLoading ?
          <View flex={1} centerContent>
            <LoadingPage />
          </View>
          :
          <>
            <View gap={8} style={{alignItems: 'center'}} animation="slideTopIn">
              <View gap={4}>
                <Text variant="large-title">Đăng nhập</Text>
                <Text variant="small" style={{color: theme.colors.tertiaryForeground}}>
                Hãy tiếp tục khám phá thế giới truyện tuyệt vời với hàng ngàn tác phẩm phong phú và thú vị!
                </Text>
              </View>
            </View>

            <View horizontal style={{alignItems: 'center'}} animation="slideTopIn">
              <Input
                variant="tertiary"
                type="text"
                value={usernameOrEmail}
                placeholder="Tên đăng nhập hoặc email"
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                style={{flex: 1}}
              />
            </View>

            <View horizontal style={{alignItems: 'center'}} animation="slideTopIn">
              <Input
                variant="tertiary"
                type="password"
                value={password}
                placeholder="Mật khẩu"
                onChange={(e) => setPassword(e.target.value)}
                style={{flex: 1}}
              />
            </View>

            <Button variant="primary" animation="slideTopIn" onClick={signIn}>Đăng nhập</Button>
          </>
        }
      </View>
    </Card>
  );
}

export default SignInPage;
