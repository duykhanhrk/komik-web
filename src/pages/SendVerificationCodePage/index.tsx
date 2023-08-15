import {Button, Card, Input, Page, Text, View} from "@components";
import {SessionService} from "@services";
import {isAxiosError} from "axios";
import {useState} from "react";
import {useNavigate} from "react-router";
import {useNotifications} from "reapop";
import {useTheme} from "styled-components";
import LoadingPage from "../LoadingPage";

function SendVerificationCodePage() {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const {notify} = useNotifications();

  function sendVerificationCode() {
    setIsLoading(true);

    // check input
    if (email.length === 0) {
      notify({
        title: 'Lỗi',
        message: 'Vui lòng nhập đầy đủ thông tin',
        status: 'error'
      });
      setIsLoading(false);
      return;
    }

    SessionService.sendVerificationCode(email)
      .then(() => navigate(`/reset_password/${email}`))
      .catch((error) => {
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
      })
      .finally(() => setIsLoading(false));
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
          <View gap={8} style={{alignItems: 'center'}} animation="slideTopIn">
            <View gap={4}>
              <Text variant="large-title">Quên mật khẩu</Text>
              <Text variant="small" style={{color: theme.colors.tertiaryForeground}}>
                Bạn đã quên mật khẩu và không thể truy cập vào tài khoản của mình? Đừng lo lắng!
              </Text>
            </View>
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

          <Button variant="primary" animation="slideTopIn" onClick={sendVerificationCode}>Gửi mã xác thực</Button>
        </>
        }
      </View>
    </Card>
  )
}

export default SendVerificationCodePage;
