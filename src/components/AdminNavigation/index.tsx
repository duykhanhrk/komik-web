import {useAppDispatch, useAppSelector, useUserProfileQuery} from "@hooks";
import {Icon} from "@iconify/react";
import {eraseUserTokens, toggleRole} from "@redux/sessionSlice";
import {toggleTheme} from "@redux/themeSlice";
import {useQueryClient} from "react-query";
import {NavLink, useNavigate} from "react-router-dom";
import styled, {useTheme} from "styled-components";
import Button from "../Button";
import Card from "../Card";
import Text from "../Text";
import View from "../View";

const Avatar = styled.img`
  height: 36px;
  width: 36px;
  border-radius: 8px;
`;

const Image = styled.img`
  max-width: 164px;
  border-radius: 8px;
`;

const SilverLink = styled.a`
  text-decoration: none;
  color: ${props => props.theme.colors.quinaryForeground};
  font-weight: bold;
`

function ControlArea() {
  const dispatch = useAppDispatch();
  const query = useUserProfileQuery();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const theme = useTheme();

  return (

    <Card shadowEffect horizontal style={{padding: 4, justifyContent: 'center'}}>
      <Button
        style={{height: 36, width: 36, padding: 6, backgroundColor: 'transparent'}}
        onClick={() => {
          dispatch(toggleRole());
          navigate('/');
        }}
      >
        <Icon icon={'mingcute:fan-2-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
      </Button>
      <Button style={{height: 36, width: 36, padding: 6, backgroundColor: 'transparent'}} onClick={() => dispatch(toggleTheme())}>
        <Icon icon={theme.mode === 'dark' ? 'mingcute:sun-line' : 'mingcute:moon-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
      </Button>
      <Button
        style={{height: 36, width: 36, padding: 6, backgroundColor: 'transparent'}}
        onClick={() => {
          dispatch(eraseUserTokens());
          queryClient.clear();
        }}
      >
        <Icon icon={'mingcute:exit-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
      </Button>
      <Button style={{height: 36, width: 36, padding: 6, backgroundColor: 'transparent'}}>
        <Avatar src={query.isSuccess ? query.data.user.avatar_url : ''}/>
      </Button>
    </Card>
  )
}

function NavArea() {
  const theme = useTheme();

  const navItemStyle = {
    display: 'flex',
    height: 36,
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: '1.0em',
    textDecoration: 'none',
    borderRadius: 8,
    padding: 8,
    gap: 8,
    color: theme.colors.foreground,
    backgroundColor: theme.colors.secondaryBackground
  }

  const navItemActiveStyle = {
    display: 'flex',
    height: 36,
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: '1.0em',
    textDecoration: 'none',
    borderRadius: 8,
    padding: 8,
    gap: 8,
    color: theme.colors.themeForeground,
    backgroundColor: theme.colors.themeBackground
  }

  return (
    <Card shadowEffect flex={1}>
      <NavLink to="/admin/profile" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>
        {({isActive}) => (
          <>
            <Icon icon={isActive ? 'mingcute:profile-fill' : 'mingcute:profile-line'} style={{color: 'inhirit', height: 20, width: 20}}/>
            <Text variant="inhirit">Hồ sơ</Text>
          </>
        )}
      </NavLink>
      <NavLink to="/admin/categories" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>
        {({isActive}) => (
          <>
            <Icon icon={isActive ? 'mingcute:layout-grid-fill' : 'mingcute:layout-grid-line'} style={{color: 'inhirit', height: 20, width: 20}}/>
            <Text variant="inhirit">Danh mục</Text>
          </>
        )}
      </NavLink>
      <NavLink to="/admin/comics" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>
        {({isActive}) => (
          <>
            <Icon icon={isActive ? 'mingcute:book-2-fill' : 'mingcute:book-2-line'} style={{color: 'inhirit', height: 20, width: 20}}/>
            <Text variant="inhirit">Truyện tranh</Text>
          </>
        )}
      </NavLink>
      <NavLink to="/admin/users" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>
        {({isActive}) => (
          <>
            <Icon icon={isActive ? 'mingcute:user-2-fill' : 'mingcute:user-2-line'} style={{color: 'inhirit', height: 20, width: 20}}/>
            <Text variant="inhirit">Người dùng</Text>
          </>
        )}
      </NavLink>
      <NavLink to="/admin/plans" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>
        {({isActive}) => (
          <>
            <Icon icon={isActive ? 'mingcute:vip-4-fill' : 'mingcute:vip-4-line'} style={{color: 'inhirit', height: 20, width: 20}}/>
            <Text variant="inhirit">Các gói</Text>
          </>
        )}
      </NavLink>
      <NavLink to="/admin/feedbacks" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>
        {({isActive}) => (
          <>
            <Icon icon={isActive ? 'mingcute:message-2-fill' : 'mingcute:message-2-line'} style={{color: 'inhirit', height: 20, width: 20}}/>
            <Text variant="inhirit">Phản hồi</Text>
          </>
        )}
      </NavLink>
      <NavLink to="/admin/documents" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>
        {({isActive}) => (
          <>
            <Icon icon={isActive ? 'mingcute:document-fill' : 'mingcute:document-line'} style={{color: 'inhirit', height: 20, width: 20}}/>
            <Text variant="inhirit">Tài liệu</Text>
          </>
        )}
      </NavLink>
    </Card>
  )
}

function AdminNavigation() {
  const { themeMode } = useAppSelector(state => state.theme);
  const theme = useTheme();

  return (
    <View gap={8} style={{padding: 8, position: 'sticky', left: 0, top: 0, bottom: 0, height: '100vh'}}>
      <ControlArea />
      <NavArea />
      <Card shadowEffect style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 12, textAlign: 'center', color: theme.colors.quinaryForeground}}>
          <SilverLink href="https://github.com/duykhanhrk/komik-web">Delta</SilverLink> & <SilverLink href="https://github.com/duykhanhrk/komik">Kakaa</SilverLink> Projects
        </Text>
        <Text style={{fontSize: 12, textAlign: 'center', color: theme.colors.quinaryForeground}}>
          Được phát triển bởi <SilverLink href="https://github.com/duykhanhrk">RK</SilverLink>
        </Text>
        <Image src={themeMode === 'dark' ? './logo_light.png' : './logo_dark.png'}/>
      </Card>
    </View>
  )
}

export default AdminNavigation;
