import {useAppDispatch, useUserProfileQuery} from "@hooks";
import {Icon} from "@iconify/react";
import {eraseUserTokens} from "@redux/sessionSlice";
import {useQueryClient} from "react-query";
import styled, {useTheme} from "styled-components";
import Button from "../Button";
import Card from "../Card";
import Modal from "../Modal";
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

function MainPanel() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const query = useUserProfileQuery();
  const queryClient = useQueryClient();

  if (query.isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View gap={8}>
      <View horizontal gap={8} style={{alignItems: 'center'}}>
        <Avatar src={query.isSuccess ? query.data.user.avatar_url : ''}/>
        <View flex={1} gap={4} style={{justifyContent: 'center'}}>
          <Text variant="title">
            { query.data.user.lastname !== '' || query.data.user.lastname !== '' ? `${query.data.user.lastname} ${query.data.user.firstname}` : `${query.data.user.username}`}
          </Text>
          <HoriLine>
            <Icon icon={'mingcute:user-2-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
            <Text>{`${query.data.user.username}`}</Text>
          </HoriLine>
          <HoriLine>
            <Icon icon={'mingcute:mail-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
            <Text>{`${query.data.user.email}`}</Text>
          </HoriLine>
          <HoriLine>
            <Icon icon={'mingcute:cake-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
            <Text>{`${query.data.user.birthday}`}</Text>
          </HoriLine>
        </View>
      </View>
      <Button
        variant="primary"
        onClick={() => {
          dispatch(eraseUserTokens());
          queryClient.clear();
        }}
        style={{columnGap: 8}}
      >
        <Icon icon={'mingcute:exit-line'} style={{height: 20, width: 20, color: theme.colors.themeForeground}} />
        <Text style={{color: theme.colors.themeForeground}}>Đăng xuất</Text>
      </Button>
      <Card style={{backgroundColor: theme.colors.tertiaryBackground, rowGap: 8}}>
        <Text variant="title">Cá nhân</Text>
        <Button variant="secondary" style={{columnGap: 8}}>
          <Icon icon={'mingcute:edit-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
          <Text style={{flex: 1}}>Chỉnh sửa thông tin cá nhân</Text>
          <Icon icon={'mingcute:right-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
        </Button>
        <Button variant="secondary" style={{columnGap: 8}}>
          <Icon icon={'mingcute:key-1-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
          <Text style={{flex: 1}}>Chỉnh sửa thông tin đăng nhập</Text>
          <Icon icon={'mingcute:right-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
        </Button>
      </Card>
      <Card style={{backgroundColor: theme.colors.tertiaryBackground, rowGap: 8}}>
        <Text variant="title">Gói</Text>
        <Button variant="secondary" style={{columnGap: 8}}>
          <Icon icon={'mingcute:vip-4-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
          <Text style={{flex: 1}}>Mua gói ngay</Text>
          <Icon icon={'mingcute:right-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
        </Button>
        <Button variant="secondary" style={{columnGap: 8}}>
          <Icon icon={'mingcute:history-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
          <Text style={{flex: 1}}>Lịch sử đăng ký gói</Text>
          <Icon icon={'mingcute:right-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
        </Button>
      </Card>
      <Modal.Test />
    </View>
  )
}

export default MainPanel;
