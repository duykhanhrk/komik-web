import {useAppSelector, useUserProfileQuery} from "@hooks";
import {NavLink, useNavigate} from "react-router-dom";
import styled, {useTheme} from "styled-components";
import useAppDispatch from "../../hooks/useAppDispatch";
import {toggleTheme} from "../../redux/themeSlice";
import { Icon } from '@iconify/react';
import Button from "../Button";
import {default as Dropdown} from '../Dropdown';
import Card from "../Card";
import {SearchInput, UserControl} from "@components";
import {eraseUserTokens, toggleRole} from "@redux/sessionSlice";
import {useQueryClient} from "react-query";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 8px;
  gap: 8px;
`;

const NavigationContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;

  @media (max-width: 720px) {
    display: none;
  }
`;

const NavigationIconContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;

  @media (min-width: 720px) {
    display: none;
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  @media (max-width: 720px) {
    display: none;
  }
`;

const UserControlContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const Avatar = styled.img`
  height: 36px;
  width: 36px;
  border-radius: 8px;
`;


function Header() {
  const dispatch = useAppDispatch();
  const query = useUserProfileQuery();
  const theme = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {userRole} = useAppSelector(state => state.session);

  const navItemStyle = {
    display: 'flex',
    height: 36,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.0em',
    textDecoration: 'none',
    borderRadius: 8,
    color: theme.colors.foreground,
    backgroundColor: theme.colors.secondaryBackground
  }

  const navItemActiveStyle = {
    display: 'flex',
    height: 36,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.0em',
    textDecoration: 'none',
    borderRadius: 8,
    color: theme.colors.themeForeground,
    backgroundColor: theme.colors.themeBackground
  }

  const navIconItemStyle = {
    display: 'flex',
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.0em',
    textDecoration: 'none',
    borderRadius: 8,
    color: theme.colors.foreground,
    backgroundColor: theme.colors.secondaryBackground
  }

  const navIconItemActiveStyle = {
    display: 'flex',
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.0em',
    textDecoration: 'none',
    borderRadius: 8,
    color: theme.colors.themeForeground,
    backgroundColor: theme.colors.themeBackground
  }

  return (
    <Container>
      <NavigationContainer>
        <Card ebonsaiSnippet animation="slideBottomIn">
          <NavLink to="/" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>Trang chủ</NavLink>
          <NavLink to="/comics" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>Danh mục</NavLink>
        </Card>
      </NavigationContainer>
      <SearchContainer>
        <Card style={{padding: 0, flex: 1}} animation="slideBottomIn">
          <SearchInput.Comic />
        </Card>
      </SearchContainer>
      <NavigationIconContainer>
        <Card ebonsaiSnippet>
          <NavLink to="/" style={({isActive}) => isActive ? navIconItemActiveStyle : navIconItemStyle}>
            <Icon icon={'mingcute:home-2-line'} style={{color: 'inherit', height: 24, width: 24}}/>
          </NavLink>
          <NavLink to="/comics" style={({isActive}) => isActive ? navIconItemActiveStyle : navIconItemStyle}>
            <Icon icon={'mingcute:grid-line'} style={{color: 'inherit', height: 24, width: 24}}/>
          </NavLink>
          <NavLink to="/search" style={({isActive}) => isActive ? navIconItemActiveStyle : navIconItemStyle}>
            <Icon icon={'mingcute:search-2-line'} style={{color: 'inherit', height: 24, width: 24}}/>
          </NavLink>
        </Card>
      </NavigationIconContainer>
      <UserControlContainer>
        <Card ebonsaiSnippet animation="slideBottomIn">
          {userRole !== 0 &&
          <Button
            ebonsai
            square
            onClick={() => {
              dispatch(toggleRole());
              navigate('/admin/profile');
            }}
          >
            <Icon icon={'mingcute:fan-2-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
          </Button>
          }
          <Button ebonsai square onClick={() => dispatch(toggleTheme())}>
            <Icon icon={theme.mode === 'dark' ? 'mingcute:sun-line' : 'mingcute:moon-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
          </Button>
          <Dropdown.Group
            dropdowns={[{
                name: 'followed-comics',
                content: <UserControl.FollowedComics />,
                buttonContent: ({isActive}) => <Icon icon={isActive ? 'mingcute:book-5-fill' : 'mingcute:book-5-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>,
              }, {
                name: 'liked-comics',
                content: <UserControl.LikedComics />,
                buttonContent: ({isActive}) => <Icon icon={isActive ? 'mingcute:heart-fill' : 'mingcute:heart-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>,
              }, {
                name: 'notifications',
                content: <UserControl.Notification />,
                buttonContent: ({isActive}) => <Icon icon={isActive ? 'mingcute:notification-fill' : 'mingcute:notification-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>,
              }, {
                name: 'plan',
                content: <UserControl.Plan />,
                buttonContent: ({isActive}) => <Icon icon={isActive ? 'mingcute:vip-4-fill' : 'mingcute:vip-4-line'} style={{color: theme.colors.foreground, height: 24, width: 24}} />,
              }
            ]}
            buttonStyle={{height: 36, width: 36, padding: 6, backgroundColor: 'transparent'}}
          />
          <Button ebonsai square
            onClick={() => {
              dispatch(eraseUserTokens());
              queryClient.clear();
            }}
          >
            <Icon icon={'mingcute:exit-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
          </Button>
          <Button ebonsai square
            onClick={() => {
              navigate('/profile');
            }}
          >
            <Avatar src={query.isSuccess && query.data.user.avatar_url ? query.data.user.avatar_url : theme.assets.defaultAvatar}/>
          </Button>
        </Card>
      </UserControlContainer>
    </Container>
  )
}

export default Header;
