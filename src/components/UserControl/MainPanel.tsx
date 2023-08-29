import {useAppDispatch, useUserProfileQuery} from '@hooks';
import {Icon} from '@iconify/react';
import {LoadingPage} from '@pages';
import {eraseUserTokens} from '@redux/sessionSlice';
import {useQueryClient} from 'react-query';
import {useNavigate} from 'react-router';
import {useTheme} from 'styled-components';
import Button from '../Button';
import Text from '../Text';
import View from '../View';

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
    return <LoadingPage />;
  }

  // { query.data.user.lastname !== '' || query.data.user.lastname !== '' ? `${query.data.user.lastname} ${query.data.user.firstname}` : `${query.data.user.username}`}

  return (
    <View gap={8} animation="slideTopIn">
      <View gap={4}>
        <Button
          variant="secondary"
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
          variant="secondary"
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
          variant="secondary"
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
          variant="secondary"
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
          <Icon icon={'mingcute:exit-line'} style={{height: 20, width: 20}} />
          <Text variant="inhirit">Đăng xuất</Text>
        </Button>
      </View>
    </View>
  );
}

export default MainPanel;
