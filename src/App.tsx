
import { Navigate, Routes, Route } from "react-router-dom";
import { ComicDetailPage, ComicPage, ErrorPage, HomePage, IntroductionPage, LoadingPage, PlanPage, ResetPasswordPage, SendVerificationCodePage, SignInPage, SignUpPage, UserProfilePage } from '@pages';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from "@hooks";
import { Header, Footer, Text, AdminNavigation, SessionLayout, Layout } from "@components";
import useTryLogin from "./hooks/useTryLogin";
import {useEffect} from "react";
import ReadingPage from "./pages/ReadingPage";
import PlanMNPage from "./pages/PlanMNPage";
import UserMNPage from "./pages/UserMNPage";
import FeedbackPage from "./pages/FeedbackPage";
import FeedbackMNPage from "./pages/FeedbackMNPage";
import ComicDetailMNPage from "./pages/ComicDetailMNPage";
import PolicyAndTermsPage from "./pages/PolicyAndTermsPage";
import ComicMNPage from "./pages/ComicMNPage";
import CategoryMNPage from "./pages/CategoryMNPage";
import ReportMNPage from "./pages/ReportMNPage";
import { useLocation, matchPath } from "react-router";
import {setRole} from "@redux/sessionSlice";

function App() {
  const { userTokens, userRole, currentRole } = useAppSelector(state => state.session);
  const { isLoading, isError, tryLogin } = useTryLogin();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const isAdminPath = matchPath("/admin/*", pathname);
  const isSignInPath = matchPath("/sign_in", pathname);

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
    )
  }

  if (isError) {
    return (
      <Layout.AppContainer>
        <Layout.AppScalableContainer>
          <ErrorPage onButtonClick={() => tryLogin()}/>;
        </Layout.AppScalableContainer>
      </Layout.AppContainer>
    )
  }

  const isAuthenticated = userTokens.refresh_token && userTokens.access_token ? true : false;
  const isAdmin = currentRole !== 0;

  if (userRole !== 0) {
    if (isAdminPath || isSignInPath) {
      dispatch(setRole(userRole))
    } else {
      dispatch(setRole(0))
    }
  }

  return (
    <Layout.AppContainer id="rootScrollable">
      <Layout.AppScalableContainer horizontal={(isAuthenticated && isAdmin) || (!isAuthenticated)}>
        <Layout.AppHeaderContainer horizontal={(isAuthenticated && isAdmin) || (!isAuthenticated)} scalable={!isAuthenticated}>
          {isAuthenticated ? (isAdmin ? <AdminNavigation /> : <Header/>) : <SessionLayout.SilverSpace />}
        </Layout.AppHeaderContainer>
        <Layout.AppContentContainer style={{}} horizontal={(isAuthenticated && isAdmin) || (!isAuthenticated)} scalable={isAuthenticated} ebonsaiShelf={!isAuthenticated}>
          {!isAuthenticated && <SessionLayout.NavigationOrnament />}
          <Routes>
            <Route path="/admin/profile" element={isAuthenticated ? (isAdmin ? <UserProfilePage /> : <Text>403</Text>) : <Navigate to={'/sign_in'} />}/>
            <Route path="/admin/categories" element={isAuthenticated ? (isAdmin ? <CategoryMNPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'} />}/>
            <Route path="/admin/plans" element={isAuthenticated ? (isAdmin ? <PlanMNPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'} />}/>
            <Route path="/admin/users" element={isAuthenticated ? (isAdmin ? <UserMNPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'} />}/>
            <Route path="/admin/feedbacks" element={isAuthenticated ? (isAdmin ? <FeedbackMNPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'} />}/>
            <Route path="/admin/comics" element={isAuthenticated ? (isAdmin ? <ComicMNPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'} />}/>
            <Route path="/admin/comics/:comic_id" element={isAuthenticated ? (isAdmin ? <ComicDetailMNPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'} />}/>
            <Route path="/admin/reports" element={isAuthenticated ? (isAdmin ? <ReportMNPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'} />}/>
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
          {!isAuthenticated && <SessionLayout.ControlOrnament />}
        </Layout.AppContentContainer>
      </Layout.AppScalableContainer>
    </Layout.AppContainer>
  );
}

export default App;
