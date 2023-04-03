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

function SignInPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {notify} = useNotifications();

  const dispatch = useAppDispatch();
  const theme = useTheme();

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

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <View horizontal flex={1}>
      <View flex={1}>
      </View>
      <View centerContent style={{width: 428}}>
        <View style={{width: 300, rowGap: 16}}>
          <View horizontal style={{alignItems: 'center'}}>
            <View style={{backgroundColor: theme.colors.themeBackground, borderTopLeftRadius: 8, borderBottomLeftRadius: 8}}>
              <Icon icon={'mingcute:user-2-line'} style={{height: 24, width: 24, margin: 8, color: theme.colors.themeForeground}} />
            </View>
            <Input
              type="text"
              value={usernameOrEmail}
              placeholder="Tên đăng nhập hoặc email"
              onChange={(e) => setUsernameOrEmail(e.target.value)}
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

          <View horizontal style={{justifyContent: 'flex-end'}}>
            <Link to={'/reset_password'} style={{fontWeight: 'bold', color: theme.colors.themeColor, textDecoration: 'none'}}>Quên mật khẩu?</Link>
          </View>

          <Button variant="primary" onClick={signIn}>Đăng nhập</Button>

          <Text style={{textAlign: 'center'}}>Chưa có tài khoản? <Link to={'/sign_up'} style={{fontWeight: 'bold', color: theme.colors.themeColor, textDecoration: 'none'}}>đăng ký ngay</Link></Text>
        </View>
      </View>
    </View>
  )
}

export default SignInPage;
