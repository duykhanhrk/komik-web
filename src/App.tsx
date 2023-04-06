
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { ErrorPage, LoadingPage } from '@pages';
import styled from 'styled-components';
import { useAppSelector } from "@hooks";
import { Header, Footer, Text, View, AdminNavigation } from "@components";
import useTryLogin from "./hooks/useTryLogin";
import React, {Suspense} from "react";

const ScrollView = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
  overflow: auto;
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  text-align: center;
  flex-direction: column;
  font-size: 1.0em;
  align-items: stretch;
  justify-content: stretch;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: stretch;
  justify-items: center;
  min-height: 100vh;
  color: ${props => props.theme.colors.foreground};
  background-color: ${props => props.theme.colors.background};
`;

function App() {
  const { userTokens, currentRole } = useAppSelector(state => state.session);
  const { isLoading, isError, tryLogin } = useTryLogin();

  const HomePage = React.lazy(() => import('./pages/HomePage'));
  const ComicPage = React.lazy(() => import('./pages/ComicPage'));
  const ComicDetailPage = React.lazy(() => import('./pages/ComicDetailPage'));
  const ReadingPage = React.lazy(() => import('./pages/ReadingPage'));
  const PlanPage = React.lazy(() => import('./pages/PlanPage'));
  const SignInPage = React.lazy(() => import('./pages/SignInPage'));
  const SignUpPage = React.lazy(() => import('./pages/SignUpPage'));
  const UserProfilePage = React.lazy(() => import('./pages/UserProfilePage'));
  const SendVerificationCodePage = React.lazy(() => import('./pages/SendVerificationCodePage'));
  const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage'));
  const IntroductionPage = React.lazy(() => import('./pages/IntroductionPage'));
  const PolicyAndTermsPage = React.lazy(() => import('./pages/PolicyAndTermsPage'));
  const FeedbackPage = React.lazy(() => import('./pages/FeedbackPage'));

  const CategoryManagentPage = React.lazy(() => import('./pages/CategoryManagentPage'));
  const PlanMNPage = React.lazy(() => import('./pages/PlanMNPage'));
  const UserMNPage = React.lazy(() => import('./pages/UserMNPage'));
  const FeedbackMNPage = React.lazy(() => import('./pages/FeedbackMNPage'));
  const ComicMNPage = React.lazy(() => import('./pages/ComicMNPage'));
  const ComicDetailMNPage = React.lazy(() => import('./pages/ComicDetailMNPage'));

  if (isLoading) {
    return (
      <Container>
        <LoadingPage />
      </Container>
    )
  }

  if (isError) {
    return (
      <Container>
        <ErrorPage onButtonClick={() => {console.log("helll"); tryLogin();}}/>;
      </Container>
    )
  }

  const isAuthenticated = userTokens.refresh_token && userTokens.access_token ? true : false;
  const isAdmin = currentRole !== 0;
  console.log(isAdmin);

  return (
    <Suspense fallback={<LoadingPage />}>
      <ScrollView id="rootScrollable">
        <Container style={{flexDirection: isAuthenticated && isAdmin ? 'row' : 'column'}}>
          {isAuthenticated ? (isAdmin ? <AdminNavigation /> : <Header/>) : null}
          <Content>
            <Routes>
              <Route path="/admin/profile" element={isAuthenticated ? (isAdmin ? <UserProfilePage /> : <Text>403</Text>) : <Navigate to={'/sign_in'} />}/>
              <Route path="/admin/categories" element={isAuthenticated ? (isAdmin ? <CategoryManagentPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'} />}/>
              <Route path="/admin/plans" element={isAuthenticated ? (isAdmin ? <PlanMNPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'} />}/>
              <Route path="/admin/users" element={isAuthenticated ? (isAdmin ? <UserMNPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'} />}/>
              <Route path="/admin/feedbacks" element={isAuthenticated ? (isAdmin ? <FeedbackMNPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'} />}/>
              <Route path="/admin/comics" element={isAuthenticated ? (isAdmin ? <ComicMNPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'} />}/>
              <Route path="/admin/comics/:comic_id" element={isAuthenticated ? (isAdmin ? <ComicDetailMNPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'} />}/>

              <Route path="/" element={isAuthenticated ? (!isAdmin ? <HomePage/> : <Text>403</Text>) : <Navigate to={'/sign_in'}/>} />
              <Route path="/comics" element={isAuthenticated ? (!isAdmin ? <ComicPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'}/>}></Route>
              <Route path="/comics/:comic_id" element={isAuthenticated ? (!isAdmin ? <ComicDetailPage/> : <Text>403</Text>) : <Navigate to={'/sign_in'}/>} />
              <Route path="/comics/:comic_id/chapters/:chapter_id" element={isAuthenticated ? (!isAdmin ? <ReadingPage/> : <Text>403</Text>) : <Navigate to={'/sign_in'}/>} />
              <Route path="/plans" element={isAuthenticated ? (!isAdmin ? <PlanPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'}/>}></Route>
              <Route path="/profile" element={isAuthenticated ? (!isAdmin ? <UserProfilePage /> : <Text>403</Text>) : <Navigate to={'/sign_in'}/>}></Route>
              <Route path="/introduction" element={isAuthenticated ? (!isAdmin ? <IntroductionPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'}/>}></Route>
              <Route path="/policy_and_terms" element={isAuthenticated ? (!isAdmin ? <PolicyAndTermsPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'}/>}></Route>
              <Route path="/feedbacks" element={isAuthenticated ? (!isAdmin ? <FeedbackPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'}/>}></Route>
              <Route path="/sign_in" element={isAuthenticated ? (isAdmin ? <Navigate to={'/admin/profile'} /> : <Navigate to={'/'} />) : <SignInPage/>} />
              <Route path="/sign_up" element={isAuthenticated ? (isAdmin ? <Navigate to={'/admin/profile'} /> : <Navigate to={'/'} />) : <SignUpPage/>} />
              <Route path="/reset_password" element={isAuthenticated ? (isAdmin ? <Navigate to={'/admin/profile'} /> : <Navigate to={'/'} />) : <SendVerificationCodePage/>} />
              <Route path="/reset_password/:email" element={isAuthenticated ? (isAdmin ? <Navigate to={'/admin/profile'} /> : <Navigate to={'/'} />) : <ResetPasswordPage/>} />
              <Route path="/sign_in" element={isAuthenticated ? (isAdmin ? <Navigate to={'/admin/profile'} /> : <Navigate to={'/'} />) : <SignInPage/>} />
              <Route path="*" element={<p>404</p>} />
            </Routes>
          </Content>
          {isAuthenticated && !isAdmin ? <Footer/> : null}
        </Container>
      </ScrollView>
    </Suspense>
  );
}

export default App;
