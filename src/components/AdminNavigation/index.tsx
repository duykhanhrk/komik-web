import {useAppDispatch, useUserProfileQuery} from "@hooks";
import {Icon} from "@iconify/react";
import {eraseUserTokens, toggleRole} from "@redux/sessionSlice";
import {toggleTheme} from "@redux/themeSlice";
import {useQueryClient} from "react-query";
import {NavLink, useNavigate} from "react-router-dom";
import styled, {useTheme} from "styled-components";
import Button from "../Button";
import Card from "../Card";
import View from "../View";

const Avatar = styled.img`
  height: 36px;
  width: 36px;
  border-radius: 8px;
`;

function AdminNavigation() {
  const dispatch = useAppDispatch();
  const query = useUserProfileQuery();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
    color: theme.colors.themeForeground,
    backgroundColor: theme.colors.themeBackground
  }

  return (
    <View gap={8} style={{padding: 8, position: 'sticky', left: 0, top: 0, bottom: 0, height: '100vh'}}>
      <Card shadowEffect horizontal style={{padding: 4}}>
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
            navigate('/');
          }}
        >
          <Icon icon={'mingcute:exit-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
        </Button>
        <Button style={{height: 36, width: 36, padding: 6, backgroundColor: 'transparent'}}>
          <Avatar src={query.isSuccess ? query.data.user.avatar_url : ''}/>
        </Button>
      </Card>
      <Card shadowEffect flex={1}>
        <NavLink to="/" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>Hồ sơ</NavLink>
        <NavLink to="/categories" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>Danh mục</NavLink>
        <NavLink to="/comics" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>Truyện tranh</NavLink>
        <NavLink to="/users" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>Người dùng</NavLink>
        <NavLink to="/plans" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>Các gói</NavLink>
        <NavLink to="/feedbacks" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>Phản hồi</NavLink>
        <NavLink to="/documents" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>Tài liệu</NavLink>
      </Card>
    </View>
  )
}

export default AdminNavigation;
