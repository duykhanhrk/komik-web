import {useAppDispatch, useAppSelector} from '@hooks';
import {Header, AdminNavigation, SessionLayout, Layout} from '@components';
import useTryLogin from './hooks/useTryLogin';
import {useEffect} from 'react';
import {useLocation, matchPath} from 'react-router';
import {setRole} from '@redux/sessionSlice';
import {activeFCMessaging} from '@helpers/FCMessagingHelper';
import AppRoutes from './routes';
import {LoadingPage, ErrorPage} from '@pages';

function App() {
  const { userTokens, userRole, currentRole } = useAppSelector(state => state.session);
  const { isLoading, isError, tryLogin } = useTryLogin();

  useEffect(() => {
    if (userTokens.refresh_token && userTokens.access_token) {
      activeFCMessaging()
        .then(() => console.log('active firebase messaging success'))
        .catch(() => console.log('active firebase messaging failed'));
    }
  }, [userTokens]);

  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const isAdminPath = matchPath('/admin/*', pathname);
  const isSignInPath = matchPath('/sign_in', pathname);

  useEffect(() => {
    document.getElementById('rootScrollable')?.scrollTo(0, 0);
  }, [pathname]);

  if (isLoading) {
    return (
      <Layout.AppContainer>
        <Layout.AppScalableContainer>
          <LoadingPage />
        </Layout.AppScalableContainer>
      </Layout.AppContainer>
    );
  }

  if (isError) {
    return (
      <Layout.AppContainer>
        <Layout.AppScalableContainer>
          <ErrorPage onButtonClick={() => tryLogin()}/>;
        </Layout.AppScalableContainer>
      </Layout.AppContainer>
    );
  }

  const isAuthenticated = !!(userTokens.refresh_token && userTokens.access_token);
  const isAdmin = currentRole !== 0;

  if (userRole !== 0) {
    if (isAdminPath || isSignInPath) {
      dispatch(setRole(userRole));
    } else {
      dispatch(setRole(0));
    }
  }

  return (
    <Layout.AppContainer id="rootScrollable">
      {!isAuthenticated ?
        <Layout.AppScalableContainer horizontal>
          <Layout.AppHeaderContainer horizontal scalable>
            <SessionLayout.SilverSpace />
          </Layout.AppHeaderContainer>
          <Layout.AppContentContainer horizontal ebonsaiShelf>
            <SessionLayout.NavigationOrnament />
            <AppRoutes />
            <SessionLayout.ControlOrnament />
          </Layout.AppContentContainer>
        </Layout.AppScalableContainer>
        : !isAdmin ?
          <Layout.AppScalableContainer>
            <Layout.AppHeaderContainer>
              <Header/>
            </Layout.AppHeaderContainer>
            <Layout.AppContentContainer scalable>
              <AppRoutes />
            </Layout.AppContentContainer>
          </Layout.AppScalableContainer>
          :
          <Layout.AppScalableContainer horizontal>
            <Layout.AppHeaderContainer horizontal>
              <AdminNavigation />
            </Layout.AppHeaderContainer>
            <Layout.AppContentContainer horizontal scalable>
              <AppRoutes />
            </Layout.AppContentContainer>
          </Layout.AppScalableContainer>
      }
    </Layout.AppContainer>
  );
}

export default App;
