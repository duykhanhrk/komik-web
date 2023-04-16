import {Button, Card, Input, Text, View} from "@components";
import {useAppDispatch} from "@hooks";
import {Icon} from "@iconify/react";
import {setUserTokens} from "@redux/sessionSlice";
import {SessionService} from "@services";
import {isAxiosError} from "axios";
import {useState} from "react";
import {Link} from "react-router-dom";
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

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <Card shadowEffect flex={1} style={{rowGap: 16, padding: 24, justifyContent: 'center', backgroundColor: theme.colors.secondaryBackground}}>
      <View horizontal style={{alignItems: 'center'}}>
        <Input
          variant="tertiary"
          type="text"
          value={username}
          placeholder="Tên đăng nhập"
          onChange={(e) => setUsername(e.target.value)}
          style={{flex: 1}}
        />
      </View>

      <View horizontal style={{alignItems: 'center'}}>
        <Input
          variant="tertiary"
          type="text"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={{flex: 1}}
        />
      </View>

      <View horizontal style={{alignItems: 'center'}}>
        <Input
          variant="tertiary"
          type="password"
          value={password}
          placeholder="Mật khẩu"
          onChange={(e) => setPassword(e.target.value)}
          style={{flex: 1}}
        />
      </View>
      <Button variant="primary" onClick={signUp}>Đăng ký</Button>
    </Card>
  )
}

export default SignUpPage;
