import {Button, Card, Input, Text, View} from "@components";
import {useAppDispatch, useAppSelector} from "@hooks";
import {Icon} from "@iconify/react";
import {setUserTokens} from "@redux/sessionSlice";
import {toggleTheme} from "@redux/themeSlice";
import {SessionService} from "@services";
import {isAxiosError} from "axios";
import {useState} from "react";
import {Link, NavLink} from "react-router-dom";
import {useNotifications} from "reapop";
import styled, {useTheme} from "styled-components";
import LoadingPage from "../LoadingPage";

const Image = styled.img`
`

const NavigationContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

function SignInPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {notify} = useNotifications();
  const {themeMode} = useAppSelector(state => state.theme);

  const dispatch = useAppDispatch();
  const theme = useTheme();

  const navItemStyle = {
    display: 'flex',
    height: 36,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.0em',
    textDecoration: 'none',
    borderRadius: 8,
    color: theme.colors.foreground,
    backgroundColor: theme.colors.secondaryBackground
  }

  const navItemActiveStyle = {
    display: 'flex',
    height: 36,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.0em',
    textDecoration: 'none',
    borderRadius: 8,
    color: theme.colors.themeForeground,
    backgroundColor: theme.colors.themeBackground
  }

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
    <Card shadowEffect flex={1} style={{rowGap: 16, padding: 24, justifyContent: 'center', backgroundColor: theme.colors.secondaryBackground}}>
      {isLoading ?
        <View centerContent>
          <LoadingPage />
        </View>
      :
      <>
        <View horizontal style={{alignItems: 'center'}}>
          <Input
            variant="tertiary"
            type="text"
            value={usernameOrEmail}
            placeholder="Tên đăng nhập hoặc email"
            onChange={(e) => setUsernameOrEmail(e.target.value)}
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

        <Button variant="primary" onClick={signIn}>Đăng nhập</Button>
      </>
      }
    </Card>
  )
}

export default SignInPage;
