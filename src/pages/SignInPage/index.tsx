import {Button, Card, Input, View} from "@components";
import {useAppDispatch} from "@hooks";
import {setUserTokens} from "@redux/sessionSlice";
import {SessionService} from "@services";
import {isAxiosError} from "axios";
import {useState} from "react";
import {useNotifications} from "reapop";
import LoadingPage from "../LoadingPage";

function SignInPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {notify} = useNotifications();

  const dispatch = useAppDispatch();

  const signIn = () => {
    setIsLoading(true);
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
  }

  return (
    <Card shadowEffect flex={1} style={{zIndex: 100}}>
      <View flex={1} style={{rowGap: 16, padding: 18, justifyContent: 'center'}}>
        {isLoading ?
          <View flex={1} centerContent>
            <LoadingPage />
          </View>
        :
        <>
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
  )
}

export default SignInPage;
