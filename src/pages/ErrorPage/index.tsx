import {Button, Text, View} from "@components";
import {isAxiosError} from "axios";
import {error} from "console";
import {useTheme} from "styled-components";

interface ErrorPageProps {
  buttonText?: string;
  onButtonClick?: () => void;
  error?: unknown;
}

function ErrorPage(props: ErrorPageProps) {
  const theme = useTheme();
  if (isAxiosError(props.error) && props.error.response?.status === 404) {
    return (
      <View flex={1} centerContent gap={8}>
        <Text variant="large-title" style={{color: theme.colors.quinaryForeground}}>404</Text>
        <Text variant="large-title" style={{color: theme.colors.quinaryForeground}}>không tìm thấy tài nguyên</Text>
      </View>
    )
  }

  return (
    <View flex={1} centerContent gap={8}>
      <Text>Đã xảy ra sự cố</Text>
      <Button variant="primary" onClick={props.onButtonClick}>{props.buttonText || 'Tải lại'}</Button>
    </View>
  )
}


export default ErrorPage;
