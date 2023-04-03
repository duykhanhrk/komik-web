import {Button, Input, Text, View} from "@components";
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
    <View flex={1} horizontal>
      <View flex={1}>
      </View>
      <View style={{width: 428}} centerContent>
        <View style={{width: 300, rowGap: 16}}>
          <View horizontal style={{alignItems: 'center'}}>
            <View style={{backgroundColor: theme.colors.themeBackground, borderTopLeftRadius: 8, borderBottomLeftRadius: 8}}>
              <Icon icon={'mingcute:user-2-line'} style={{height: 24, width: 24, margin: 8, color: theme.colors.themeForeground}} />
            </View>
            <Input
              type="text"
              value={username}
              placeholder="Tên đăng nhập"
              onChange={(e) => setUsername(e.target.value)}
              style={{flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
            />
          </View>

          <View horizontal style={{alignItems: 'center'}}>
            <View style={{backgroundColor: theme.colors.themeBackground, borderTopLeftRadius: 8, borderBottomLeftRadius: 8}}>
              <Icon icon={'mingcute:mail-line'} style={{height: 24, width: 24, margin: 8, color: theme.colors.themeForeground}} />
            </View>
            <Input
              type="text"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              style={{flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
            />
          </View>

          <View horizontal style={{alignItems: 'center'}}>
            <View style={{backgroundColor: theme.colors.themeBackground, borderTopLeftRadius: 8, borderBottomLeftRadius: 8}}>
              <Icon icon={'mingcute:key-1-line'} style={{height: 24, width: 24, margin: 8, color: theme.colors.themeForeground}} />
            </View>
            <Input
              type="password"
              value={password}
              placeholder="Mật khẩu"
              onChange={(e) => setPassword(e.target.value)}
              style={{flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
            />
          </View>
          <Button variant="primary" onClick={signUp}>Đăng ký</Button>
          <Text style={{textAlign: 'center'}}>Đã có tài khoản? <Link to={'/sign_in'} style={{fontWeight: 'bold', textDecoration: 'none', color: theme.colors.themeColor}}>đăng nhập ngay</Link></Text>
        </View>
      </View>
    </View>
  )
}

export default SignUpPage;
