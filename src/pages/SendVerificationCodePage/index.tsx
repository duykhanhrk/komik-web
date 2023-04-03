import {Button, Input, Page, View} from "@components";
import {SessionService} from "@services";
import {isAxiosError} from "axios";
import {useState} from "react";
import {useNavigate} from "react-router";
import {useNotifications} from "reapop";
import LoadingPage from "../LoadingPage";

function SendVerificationCodePage() {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
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
    <Page.Container>
      <Page.Content>
        <View horizontal centerContent flex={1}>
          <View gap={8}>
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button variant="primary" onClick={sendVerificationCode}>Gửi mã xác thực</Button>
          </View>
        </View>
      </Page.Content>
    </Page.Container>
  )
}

export default SendVerificationCodePage;
