import {useAppSelector} from '@hooks';
import {Link} from 'react-router-dom';
import styled, {useTheme} from 'styled-components';
import Text from '../Text';
import View from '../View';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  padding: 32px;
  gap: 8px;

  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

const Image = styled.img`
  height: 60px;
  width: 142px;
  border-radius: 8px;
`;

const SilverLink = styled.a`
  text-decoration: none;
  color: ${props => props.theme.colors.quinaryForeground};
  font-weight: bold;
`;

function Footer() {
    const { themeMode } = useAppSelector(state => state.theme);
    const theme = useTheme();

    return (
        <Container>
            <View flex={1} gap={8} style={{alignItems: 'center', justifyContent: 'center'}}>
                <Image src={themeMode === 'dark' ? './logo_light.png' : './logo_dark.png'}/>
                <Text style={{fontSize: 12, textAlign: 'center', color: theme.colors.quinaryForeground}}>
                    <SilverLink href="https://github.com/duykhanhrk/komik-web">Delta</SilverLink> & <SilverLink href="https://github.com/duykhanhrk/komik">Kakaa</SilverLink> Projects
                </Text>
                <Text style={{fontSize: 12, textAlign: 'center', color: theme.colors.quinaryForeground}}>
          Được phát triển bởi <SilverLink href="https://github.com/duykhanhrk">RK</SilverLink>
                </Text>
            </View>
            <View flex={1} gap={8} style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text variant="medium-title">Về Komik</Text>
                <Link to={'/introduction'} style={{textDecoration: 'none', color: theme.colors.foreground}}>Giới thiệu</Link>
                <Link to={'/policy_and_terms'} style={{textDecoration: 'none', color: theme.colors.foreground}}>Chính sách và điều khoản</Link>
                <Link to={'/feedbacks'} style={{textDecoration: 'none', color: theme.colors.foreground}}>Phản hồi</Link>
            </View>
            <View flex={1} gap={8} style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text variant="medium-title">Liên hệ</Text>
                <Text>Số điện thoại: 0341234567</Text>
                <Text>Email: admin@komik.fortisiks.space</Text>
                <Text>Twitter: Komik Offical</Text>
            </View>
        </Container>
    );
}

export default Footer;
