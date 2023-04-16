import {useAppDispatch, useUserProfileQuery} from "@hooks";
import {Icon} from "@iconify/react";
import {LoadingPage} from "@pages";
import {eraseUserTokens} from "@redux/sessionSlice";
import {useQueryClient} from "react-query";
import {useNavigate} from "react-router";
import styled, {useTheme} from "styled-components";
import Button from "../Button";
import Card from "../Card";
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

  return (
    <View gap={8}>
      <Card
        horizontal
        style={{alignItems: 'center'}}
      >
        <Avatar src={query.isSuccess && query.data.user.avatar_url ? query.data.user.avatar_url : theme.assets.defaultAvatar}/>
        <View flex={1} gap={4} style={{justifyContent: 'center'}}>
          <Text variant="title" numberOfLines={1}>
            { query.data.user.lastname !== '' || query.data.user.lastname !== '' ? `${query.data.user.lastname} ${query.data.user.firstname}` : `${query.data.user.username}`}
          </Text>
          <HoriLine>
            <Icon icon={'mingcute:user-2-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
            <Text numberOfLines={1}>{`${query.data.user.username}`}</Text>
          </HoriLine>
          <HoriLine>
            <Icon icon={'mingcute:mail-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
            <Text numberOfLines={1}>{`${query.data.user.email}`}</Text>
          </HoriLine>
          <HoriLine>
            <Icon icon={'mingcute:cake-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
            <Text numberOfLines={1}>{`${query.data.user.birthday}`}</Text>
          </HoriLine>
        </View>
      </Card>
      <View horizontal gap={8}>
        <Button
          variant="tertiary"
          onClick={() => {
            props.onItemClick && props.onItemClick();
            navigate('/profile');
          }}
          style={{columnGap: 8, flex: 1}}
        >
          <Icon icon={'mingcute:edit-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
          <Text style={{color: theme.colors.foreground}}>Chỉnh sửa</Text>
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
