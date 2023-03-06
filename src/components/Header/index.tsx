import {useUserProfileQuery} from "@hooks";
import {NavLink} from "react-router-dom";
import styled, {useTheme} from "styled-components";
import useAppDispatch from "../../hooks/useAppDispatch";
import {toggleTheme} from "../../redux/themeSlice";
import { Icon } from '@iconify/react';
import Button from "../Button";
import Input from "../Input";
import {default as Dropdown} from '../Dropdown';
import {useEffect, useRef, useState} from "react";
import Text from "../Text";
import {useQueryClient} from "react-query";
import {eraseUserTokens} from "@redux/sessionSlice";

const navItemStyle = {
  display: 'flex',
  height: 40,
  width: 120,
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.3em',
  textDecoration: 'none',
  color: 'inherit'
}

const navItemActiveStyle = {
  display: 'flex',
  height: 40,
  width: 120,
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.3em',
  textDecoration: 'none',
  color: 'inherit',
  fontWeight: 'bold'
}

const BarContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 56px;
  padding: 8px;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
  z-index: 1
`;

const SubContainer = styled.div`
  display: flex;
  flexDirection: row;
  height: 40px;
  width: 240px;
`;

const MidContainer = styled.div`
  flex: 1;
  display: flex;
  flexDirection: row;
  height: 40px;
  justify-content: center;
`;

const Avatar = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 8px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.secondaryBackground};
  border-radius: 8px;
  width: 350px;
  padding: 8px;
`;

const HoriLine = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 8px;
`

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const query = useUserProfileQuery();
  const theme = useTheme();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [dropDownRef]);

  return (
    <BarContainer>
      <SubContainer>
        <NavLink to="/" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>Trang chủ</NavLink>
        <NavLink to="/hi" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>Danh mục</NavLink>
      </SubContainer>
      <MidContainer>
        <Input style={{marginRight: 8, marginLeft: 8}}/>
      </MidContainer>
      <SubContainer style={{justifyContent: 'flex-end', columnGap: 8}}>
        <Button style={{height: 40, width: 40, backgroundColor: 'transparent'}} onClick={() => dispatch(toggleTheme())}>
          <Icon icon={theme.mode === 'dark' ? 'mingcute:sun-line' : 'mingcute:moon-line'} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
        </Button>
        <Dropdown.Container ref={dropDownRef}>
          <Avatar
            src={query.isSuccess ? query.data.user.avatar_url : ''}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />
          {isDropdownOpen &&
          <Dropdown.Content style={{rowGap: 8}}>
            {query.isSuccess &&
              <>
                <Card style={{flexDirection: 'row', columnGap: 8, padding: 0, alignItems: 'center'}}>
                  <Avatar
                    src={query.isSuccess ? query.data.user.avatar_url : ''}
                    style={{height: 100, width: 100}}
                  />
                  <Card style={{padding: 0, justifyContent: 'center', rowGap: 4}}>
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
                  </Card>
                </Card>
                <Button
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
                  <Button variant="secondary" style={{columnGap: 8}}>
                    <Icon icon={'mingcute:book-5-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
                    <Text style={{flex: 1}}>Truyện đang theo dõi</Text>
                    <Icon icon={'mingcute:right-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
                  </Button>
                  <Button variant="secondary" style={{columnGap: 8}}>
                    <Icon icon={'mingcute:heart-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
                    <Text style={{flex: 1}}>Truyện yêu thích</Text>
                    <Icon icon={'mingcute:right-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
                  </Button>
                  <Button variant="secondary" style={{columnGap: 8}}>
                    <Icon icon={'mingcute:notification-line'} style={{height: 20, width: 20, color: theme.colors.foreground}} />
                    <Text style={{flex: 1}}>Thông báo</Text>
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
              </>
            }
          </Dropdown.Content>
          }
        </Dropdown.Container>
      </SubContainer>
    </BarContainer>
  )
}

export default Header;
