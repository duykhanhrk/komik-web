import {Text, View} from "@components";

import { Spinner } from "react-activity";
import "react-activity/dist/library.css";
import {useTheme} from "styled-components";

function LoadingPage() {
  const theme = useTheme();
  return (
    <View flex={1} centerContent gap={8}>
      <Spinner color={theme.colors.themeColor} size={24} speed={1} animating={true} />
    </View>
  )
}

export default LoadingPage;
