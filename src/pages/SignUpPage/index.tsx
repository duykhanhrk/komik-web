import {Button, Card, Input, Text, View} from "@components";
import {useAppDispatch} from "@hooks";
import {setUserTokens} from "@redux/sessionSlice";
import {SessionService} from "@services";
import {isAxiosError} from "axios";
import {useState} from "react";
import {useNotifications} from "reapop";
import {useTheme} from "styled-components";
import LoadingPage from "../LoadingPage";

function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const theme = useTheme();
  const {notify} = useNotifications();

  const signUp = () => {
    setIsLoading(true);
    SessionService.signUpAsync({
      email,
      username,
      password
    }).then((data) => {
      dispatch(setUserTokens(data));
    }).catch((error) => {
      if (isAxiosError(error) && error.response) {
        notify({
          title: 'Lỗi',
          message: error.response.data.message,
          status: 'error'
        });
      } else {
        notify({
          title: 'Lỗi',
          message: 'Có lỗi xảy ra, vui lòng thử lại sau',
          status: 'error'
        });
      }
    }).finally(() => {
      setIsLoading(false);
    });
  }

  return (
    <Card shadowEffect flex={1} style={{zIndex: 100}}>
      <View flex={1} style={{gap: 16, padding: 16, justifyContent: 'center'}}>
        {isLoading ?
          <View flex={1} centerContent>
            <LoadingPage />
          </View>
        :
        <>
          <View gap={8} style={{alignItems: 'center'}} animation="slideTopIn">
            <View gap={4}>
              <Text variant="large-title">Đăng ký</Text>
              <Text variant="small" style={{color: theme.colors.tertiaryForeground}}>
                Bạn đã sẵn sàng gia nhập cộng đồng đọc giả đầy sôi động và khám phá trải nghiệm đặc biệt cùng chúng tôi? 
              </Text>
            </View>
          </View>

          <View horizontal style={{alignItems: 'center'}} animation="slideTopIn">
            <Input
              variant="tertiary"
              type="text"
              value={username}
              placeholder="Tên đăng nhập"
              onChange={(e) => setUsername(e.target.value)}
              style={{flex: 1}}
            />
          </View>

          <View horizontal style={{alignItems: 'center'}} animation="slideTopIn">
            <Input
              variant="tertiary"
              type="text"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
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
          <Button variant="primary" animation="slideTopIn" onClick={signUp}>Đăng ký</Button>
        </>
        }
      </View>
    </Card>
  )
}

export default SignUpPage;
