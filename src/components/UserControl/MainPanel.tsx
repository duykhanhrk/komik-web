import {useAppDispatch, useUserProfileQuery} from "@hooks";
import {Icon} from "@iconify/react";
import {LoadingPage} from "@pages";
import {eraseUserTokens} from "@redux/sessionSlice";
import {useQueryClient} from "react-query";
import {useNavigate} from "react-router";
import styled, {useTheme} from "styled-components";
import Button from "../Button";
import Card from "../Card";
import Tag from "../Tag";
import Text from "../Text";
import View from "../View";

const Avatar = styled.img`
  height: 100px;
  width: 100px;
  border-radius: 8px;
`;

const HoriLine = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 8px;
`;

interface MainPanelProps {
  onItemClick?: () => void;
}

function MainPanel(props: MainPanelProps) {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const query = useUserProfileQuery();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  if (query.isLoading) {
    return <LoadingPage />
  }

  // { query.data.user.lastname !== '' || query.data.user.lastname !== '' ? `${query.data.user.lastname} ${query.data.user.firstname}` : `${query.data.user.username}`}

  return (
    <View gap={8} animation="slideTopIn">
      <View gap={4}>
        <Button
          variant="tertiary"
          onClick={() => {
            props.onItemClick && props.onItemClick();
            navigate('/profile');
          }}
          style={{columnGap: 8, flex: 1, justifyContent: 'flex-start'}}
        >
          <Icon icon={'mingcute:profile-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
          <Text style={{color: theme.colors.foreground}}>Hồ sơ</Text>
        </Button>
        <Button
          variant="tertiary"
          onClick={() => {
            props.onItemClick && props.onItemClick();
            navigate('/feedbacks');
          }}
          style={{columnGap: 8, flex: 1, justifyContent: 'flex-start'}}
        >
          <Icon icon={'mingcute:message-1-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
          <Text style={{color: theme.colors.foreground}}>Phản hồi</Text>
        </Button>
        <Button
          variant="tertiary"
          onClick={() => {
            props.onItemClick && props.onItemClick();
            navigate('/introduction');
          }}
          style={{columnGap: 8, flex: 1, justifyContent: 'flex-start'}}
        >
          <Icon icon={'mingcute:leaf-3-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
          <Text style={{color: theme.colors.foreground}}>Giới thiệu</Text>
        </Button>
        <Button
          variant="tertiary"
          onClick={() => {
            props.onItemClick && props.onItemClick();
            navigate('/policy_and_terms');
          }}
          style={{columnGap: 8, flex: 1, justifyContent: 'flex-start'}}
        >
          <Icon icon={'mingcute:document-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
          <Text style={{color: theme.colors.foreground}}>Điều khoản</Text>
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            props.onItemClick && props.onItemClick();
            dispatch(eraseUserTokens());
            queryClient.clear();
          }}
          style={{columnGap: 8, flex: 1}}
        >
          <Icon icon={'mingcute:exit-line'} style={{height: 20, width: 20, color: theme.colors.themeForeground}} />
          <Text style={{color: theme.colors.themeForeground}}>Đăng xuất</Text>
        </Button>
      </View>
    </View>
  )
}

export default MainPanel;
