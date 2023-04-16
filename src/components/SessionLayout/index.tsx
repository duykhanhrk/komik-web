import View from "../View"
import styled, {useTheme} from "styled-components";
import Card from "../Card";
import {NavLink} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "@hooks";
import Button from "../Button";
import {Icon} from "@iconify/react";
import {toggleTheme} from "@redux/themeSlice";
import Text from "../Text";

const NavigationContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

function NavigationOrnament() {
  const theme = useTheme();

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

  return (
    <View horizontal>
      <NavigationContainer>
        <Card horizontal style={{padding: 4}} shadowEffect>
          <NavLink to="/sign_up" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>Đăng ký</NavLink>
          <NavLink to="/sign_in" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>Đăng nhập</NavLink>
          <NavLink to="/reset_password" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>Tài khoản</NavLink>
        </Card>
      </NavigationContainer>
    </View>
  )
}

const SilverLink = styled.a`
  text-decoration: none;
  color: ${props => props.theme.colors.quinaryForeground};
  font-weight: bold;
`

function ControlOrnament() {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  return (
    <Card shadowEffect horizontal style={{padding: 4, alignItems: 'center'}}>
      <View flex={1} centerContent>
        <Text style={{fontSize: 12, textAlign: 'center', color: theme.colors.quinaryForeground}}>
          <SilverLink>Komik</SilverLink> - Ứng dụng đọc truyện tranh
        </Text>
      </View>
      <Button style={{height: 36, width: 36, padding: 6, backgroundColor: 'transparent'}} onClick={() => dispatch(toggleTheme())}>
        <Icon icon={theme.mode === 'dark' ? 'mingcute:sun-line' : 'mingcute:moon-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
      </Button>
    </Card>
  )
}

function SilverSpace() {
  const {themeMode} = useAppSelector(state => state.theme);

  return (
    <View flex={1} centerContent>
      <img
        src={themeMode === 'dark' ? './komik-icon-light.png' : './komik-icon-dark.png'}
        style={{width: '64vh', height: '64vh'}}
      />
    </View>
  )
}

export default {NavigationOrnament, SilverSpace, ControlOrnament};
