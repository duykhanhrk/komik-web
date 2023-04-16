import {Button, Card, Input, Page, View} from "@components";
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

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <Card shadowEffect flex={1} style={{rowGap: 16, padding: 24, justifyContent: 'center', backgroundColor: theme.colors.secondaryBackground}}>
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

      <Button variant="primary" onClick={sendVerificationCode}>Gửi mã xác thực</Button>
    </Card>
  )
}

export default SendVerificationCodePage;
