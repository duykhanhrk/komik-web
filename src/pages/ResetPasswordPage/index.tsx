import {Button, Input, Page, View} from "@components";
import {SessionService, UserService} from "@services";
import {isAxiosError} from "axios";
import {useState} from "react";
import {useNavigate, useParams} from "react-router";
import {useNotifications} from "reapop";
import LoadingPage from "../LoadingPage";

function ResetPasswordPage() {
  const [verificationCode, setVerificatonCode] = useState<string>('');
  const { email } = useParams();
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const {notify} = useNotifications();

  function resetPassword() {
    setIsLoading(true);
    SessionService.resetPassword(email || '', verificationCode, newPassword)
      .then(() => {
        notify({
          title: 'Thành công',
          message: 'Đặt lại mật khẩu thành công',
          status: 'success'
        });
        navigate('/sign_in');
      })
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
            <Input placeholder="Mã xác thực" value={verificationCode} onChange={(e) => setVerificatonCode(e.target.value)} />
            <Input type="password" placeholder="Mật khẩu mới" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <Input type="password" placeholder="Mật khẩu mới nhập lại" value={newPasswordConfirmation} onChange={(e) => setNewPasswordConfirmation(e.target.value)} />
            <Button variant="primary" onClick={resetPassword}>Xác nhận</Button>
          </View>
        </View>
      </Page.Content>
    </Page.Container>
  )
}

export default ResetPasswordPage;
