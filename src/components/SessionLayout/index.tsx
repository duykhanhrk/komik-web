import View from "../View"
import styled, {useTheme} from "styled-components";
import Card from "../Card";
import {NavLink} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "@hooks";
import Button from "../Button";
import {Icon} from "@iconify/react";
import {toggleTheme} from "@redux/themeSlice";
import Text from "../Text";
import BackgroundImage from "../BackgroundImage";
import {useState} from "react";
import {Carousel} from "react-responsive-carousel";
import {PreText} from "@components";
import {useQuery} from "react-query";
import {DocumentService} from "@services";
import {LoadingPage} from "@pages";

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
    backgroundColor: `${theme.colors.themeBackground}`
  }

  return (
    <View horizontal animation="slideTopIn" style={{zIndex: 100}}>
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
    <Card shadowEffect horizontal style={{padding: 4, alignItems: 'center', zIndex: 100}} animation="slideBottomIn">
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

function PolicyAndTermSuki() {
  const theme = useTheme();

  const query = useQuery({
    queryKey: ['session', 'policy_and_term'],
    queryFn: () => DocumentService.getPolicyAndTermsAsync()
  });

  return (
    <Card flex={1} centerContent style={{backgroundColor: `${theme.colors.secondaryBackground}66`}}>
      {query.isLoading ?
        <LoadingPage />
        :
        <View flex={1} scrollable animation="slideTopIn">
          <View gap={8} style={{textAlign: 'justify', padding: 8, color: theme.colors.foreground}} dangerouslySetInnerHTML={{ __html: query.data.policy_and_terms.value }}>
          </View>
        </View>
      }
    </Card>
  )
}

function IntroductionSuki() {
  const theme = useTheme();

  const query = useQuery({
    queryKey: ['session', 'introduction'],
    queryFn: () => DocumentService.getIntroductionAsync()
  });

  return (
    <Card flex={1} centerContent style={{backgroundColor: `${theme.colors.secondaryBackground}66`}}>
      {query.isLoading ?
        <LoadingPage />
        :
        <View flex={1} scrollable animation="slideTopIn">
          <View gap={8} style={{textAlign: 'justify', padding: 8, color: theme.colors.foreground}} dangerouslySetInnerHTML={{ __html: query.data.introduction.value }}>
          </View>
        </View>
      }
    </Card>
  )
}

function SilverSpace() {
  const [backgroundImage, setBackgroundImage] = useState<string>('./haru.jpg');
  const [suki, setSuki] = useState<'komik' | 'comics' | 'seasons' | 'games' | 'discuss' | 'policy_and_term' | 'introduction'>('komik');

  const {themeMode} = useAppSelector(state => state.theme);
  const theme = useTheme();

  return (
    <View flex={1}>
      <BackgroundImage src={backgroundImage} blur={6} style={{position: 'fixed', left: 0, right: 0, bottom: 0, top: 0}}>
        <View
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: backgroundImage === '' ? theme.colors.background : `${theme.colors.background}EE`
          }}
        >
        </View>
      </BackgroundImage>
      <View flex={1} gap={8} centerContent style={{zIndex: 100}}>
        <View horizontal style={{width: '64vw', height: '36vw', borderRadius: 8}}>
          {(suki === 'komik') &&
            <Card flex={1} style={{padding: 0, width: '64vw', height: '36vw', backgroundColor: 'transparent'}}>
              <View flex={1} style={{padding: 0, width: '64vw', height: '36vw'}} animation="slideLeftIn" animationDuration={1}>
                <Carousel
                  showThumbs={false}
                  showStatus={false}
                  showArrows={false}
                  showIndicators={false}
                  autoPlay
                  infiniteLoop
                  interval={4000}
                >
                  <View flex={1} style={{width: '64vw', height: '36vw', padding: 8}} centerContent>
                    <Text style={{fontSize: '6.4em', textAlign: 'center'}}>
                      <b>{'Komik '}</b>
                      {' ứng dụng đọc truyện tranh'}</Text>
                  </View>
                  <View flex={1} style={{width: '64vw', height: '36vw', padding: 8}} centerContent>
                    <Text style={{fontSize: '6.4em', textAlign: 'center'}}>
                      <b style={{color: theme.colors.blue}}>Giao diện</b>
                      {' đơn giản dễ sử dụng'}
                    </Text>
                  </View>
                  <View flex={1} style={{width: '64vw', height: '36vw', padding: 8}} centerContent>
                    <Text style={{fontSize: '6.4em', textAlign: 'center'}}>
                      <b style={{color: theme.colors.green}}>Kho truyện tranh</b>
                      {' khổng lồ lên đến '}
                      <b>1000+</b>
                    </Text>
                  </View>
                  <View flex={1} style={{width: '64vw', height: '36vw', padding: 8}} centerContent>
                    <Text style={{fontSize: '6.4em', textAlign: 'center'}}>
                      {'Nhiều '}
                      <b style={{color: theme.colors.red}}>tính năng nổi bật</b>
                      {' hấp dẫn'}
                    </Text>
                  </View>

                  <View flex={1} style={{width: '64vw', height: '36vw', padding: 8}} centerContent>
                    <Text style={{fontSize: '6.4em', textAlign: 'center'}}>
                      <b>Hãy đăng ký ngay</b>
                    </Text>
                  </View>
                </Carousel>
              </View>
            </Card>
          }
          {(suki === 'comics' || suki === 'games' || suki === 'discuss') &&
            <Card flex={1} centerContent style={{backgroundColor: `${theme.colors.secondaryBackground}66`}}>
              <Text variant="large-title" style={{color: theme.colors.quinaryForeground}}>Tính năng đang được cập nhật</Text>
            </Card>
          }
          {suki === 'policy_and_term' && <PolicyAndTermSuki />}
          {suki === 'introduction' && <IntroductionSuki />}
          {suki === 'seasons' &&
          <>
          <View flex={1}>
            <Card
              flex={1}
              animation="SilverSlideTopIn"
              animationDuration={1}
              shadowEffect
              style={{borderRadius: '8px 0 0 0', padding: '8px 4px 4px 8px', overflow: 'hidden', backgroundColor: `${theme.colors.secondaryBackground}66`}}
              onClick={() => setBackgroundImage('./haru.jpg')}
            >
              <img
                src={'./haru.jpg'}
                style={{width: '100%', height: '100%', objectFit: 'cover', overflow: 'hidden', borderRadius: '8px 0 0 0'}}
              />
            </Card>
            <Card
              flex={1}
              animation="SilverSlideLeftIn"
              animationDuration={1}
              shadowEffect
              style={{borderRadius: '0 0 0 8px', padding: '4px 4px 8px 8px', overflow: 'hidden', backgroundColor: `${theme.colors.secondaryBackground}66`}}
              onClick={() => setBackgroundImage('./natsu.jpg')}
            >
              <img
                src={'./natsu.jpg'}
                style={{width: '100%', height: '100%', objectFit: 'cover', overflow: 'hidden', borderRadius: '0 0 0 8px'}}
              />
            </Card>
          </View>
          <View flex={1}>
            <Card
              flex={1}
              animation="SilverSlideRightIn"
              animationDuration={1}
              shadowEffect
              style={{borderRadius: '0 8px 0 0', padding: '8px 8px 4px 4px', overflow: 'hidden', backgroundColor: `${theme.colors.secondaryBackground}66`}}
              onClick={() => setBackgroundImage('./aki.jpg')}
            >
              <img
                src={'./aki.jpg'}
                style={{width: '100%', height: '100%', objectFit: 'cover', overflow: 'hidden', borderRadius: '0 8px 0 0'}}
              />
            </Card>
            <Card
              flex={1}
              animation="SilverSlideBottomIn"
              animationDuration={1}
              shadowEffect
              style={{borderRadius: '0 0 8px 0', padding: '4px 8px 8px 4px', overflow: 'hidden', backgroundColor: `${theme.colors.secondaryBackground}66`}}
              onClick={() => setBackgroundImage('./fuyu.jpg')}
            >
              <img
                src={'./fuyu.jpg'}
                style={{width: '100%', height: '100%', objectFit: 'cover', overflow: 'hidden', borderRadius: '0 0 8px 0'}}
              />
            </Card>
          </View>
          </>
          }
        </View>
        <Card ebonsaiSnippet animation="slideTopIn" animationDuration={1} style={{backgroundColor: `${theme.colors.secondaryBackground}00`}}>
          <Button ebonsai square onClick={() => setSuki('komik')}>
            <Icon icon={suki === 'komik' ? "mingcute:leaf-3-fill" : "mingcute:leaf-3-line"} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
          </Button>
          <Button ebonsai square onClick={() => setSuki('comics')}>
            <Icon icon={suki === 'comics' ? "mingcute:book-2-fill" : "mingcute:book-2-line"} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
          </Button>
          <Button ebonsai square onClick={() => setSuki('seasons')}>
            <Icon icon={suki === 'seasons' ? "mingcute:flower-3-fill" : "mingcute:flower-3-line"} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
          </Button>
          <Button ebonsai square onClick={() => setSuki('games')}>
            <Icon icon={suki === 'games' ? "mingcute:game-2-fill" : "mingcute:game-2-line"} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
          </Button>
          <Button ebonsai square onClick={() => setSuki('discuss')}>
            <Icon icon={suki === 'discuss' ? "mingcute:comment-fill" : "mingcute:comment-line"} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
          </Button>
          <Button ebonsai square onClick={() => setSuki('policy_and_term')}>
            <Icon icon={suki === 'policy_and_term' ? "mingcute:document-fill" : "mingcute:document-line"} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
          </Button>
          <Button ebonsai square onClick={() => setSuki('introduction')}>
            <Icon icon={suki === 'introduction' ? "mingcute:information-fill" : "mingcute:information-line"} style={{color: theme.colors.foreground, height: 24, width: 24}}/>
          </Button>
        </Card>
      </View>
    </View>
  )
}

export default {NavigationOrnament, SilverSpace, ControlOrnament};
