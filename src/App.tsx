
import { Navigate, Routes, Route } from "react-router-dom";
import { AuthorDetailMNPage, AuthorMNPage, ComicDetailPage, ComicPage, ErrorPage, HomePage, IntroductionPage, LoadingPage, PlanPage, ResetPasswordPage, SendVerificationCodePage, SignInPage, SignUpPage, UserProfilePage } from '@pages';
import { useAppDispatch, useAppSelector } from "@hooks";
import { Header, Text, AdminNavigation, SessionLayout, Layout, View } from "@components";
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
import NotFoundPage from "./pages/NotFoundPage";
import { useLocation, matchPath } from "react-router";
import {setRole} from "@redux/sessionSlice";

function Content() {
  const { userTokens, currentRole } = useAppSelector(state => state.session);

  const isAuthenticated = userTokens.refresh_token && userTokens.access_token ? true : false;
  const isAdmin = currentRole !== 0;

  return (
    <Routes>
      <Route path="/admin/profile" element={isAuthenticated ? (isAdmin ? <UserProfilePage /> : <NotFoundPage />) : <Navigate to={'/sign_in'} />}/>
      <Route path="/admin/categories" element={isAuthenticated ? (isAdmin ? <CategoryMNPage /> : <NotFoundPage />) : <Navigate to={'/sign_in'} />}/>
      <Route path="/admin/authors" element={isAuthenticated ? (isAdmin ? <AuthorMNPage /> : <NotFoundPage />) : <Navigate to={'/sign_in'} />}/>
      <Route path="/admin/authors/:id" element={isAuthenticated ? (isAdmin ? <AuthorDetailMNPage /> : <NotFoundPage />) : <Navigate to={'/sign_in'} />}/>
      <Route path="/admin/plans" element={isAuthenticated ? (isAdmin ? <PlanMNPage /> : <NotFoundPage />) : <Navigate to={'/sign_in'} />}/>
      <Route path="/admin/users" element={isAuthenticated ? (isAdmin ? <UserMNPage /> : <NotFoundPage />) : <Navigate to={'/sign_in'} />}/>
      <Route path="/admin/feedbacks" element={isAuthenticated ? (isAdmin ? <FeedbackMNPage /> : <NotFoundPage />) : <Navigate to={'/sign_in'} />}/>
      <Route path="/admin/comics" element={isAuthenticated ? (isAdmin ? <ComicMNPage /> : <NotFoundPage />) : <Navigate to={'/sign_in'} />}/>
      <Route path="/admin/comics/:comic_id" element={isAuthenticated ? (isAdmin ? <ComicDetailMNPage /> : <NotFoundPage />) : <Navigate to={'/sign_in'} />}/>
      <Route path="/admin/reports" element={isAuthenticated ? (isAdmin ? <ReportMNPage /> : <NotFoundPage />) : <Navigate to={'/sign_in'} />}/>
      <Route path="/" element={isAuthenticated ? (!isAdmin ? <HomePage/> : <Text>403</Text>) : <Navigate to={'/sign_in'}/>} />
      <Route path="/comics" element={isAuthenticated ? (!isAdmin ? <ComicPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'}/>}></Route>
      <Route path="/comics/stars" element={isAuthenticated ? (!isAdmin ? <ComicPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'}/>}></Route>
      <Route path="/comics/categories" element={isAuthenticated ? (!isAdmin ? <ComicPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'}/>}></Route>
      <Route path="/comics/release_dates" element={isAuthenticated ? (!isAdmin ? <ComicPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'}/>}></Route>
      <Route path="/comics/searching" element={isAuthenticated ? (!isAdmin ? <ComicPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'}/>}></Route>
      <Route path="/comics/filter" element={isAuthenticated ? (!isAdmin ? <ComicPage /> : <Text>403</Text>) : <Navigate to={'/sign_in'}/>}></Route>
      <Route path="/comics/detail/:comic_id" element={isAuthenticated ? (!isAdmin ? <ComicDetailPage/> : <Text>403</Text>) : <Navigate to={'/sign_in'}/>} />
      <Route path="/comics/detail/:comic_id/chapters/:chapter_id" element={isAuthenticated ? (!isAdmin ? <ReadingPage/> : <Text>403</Text>) : <Navigate to={'/sign_in'}/>} />
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
      <Route path="*" element={isAuthenticated ? (!isAdmin ? <NotFoundPage /> : <p>404</p>) : <Navigate to={'/sign_in'} />} />
    </Routes>
  )
}

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
      {!isAuthenticated ?
        <Layout.AppScalableContainer horizontal>
          <Layout.AppHeaderContainer horizontal scalable>
            <SessionLayout.SilverSpace />
          </Layout.AppHeaderContainer>
          <Layout.AppContentContainer horizontal ebonsaiShelf>
            <SessionLayout.NavigationOrnament />
            <Content />
            <SessionLayout.ControlOrnament />
          </Layout.AppContentContainer>
        </Layout.AppScalableContainer>
      : !isAdmin ?
        <Layout.AppScalableContainer>
          <Layout.AppHeaderContainer>
            <Header/>
          </Layout.AppHeaderContainer>
          <Layout.AppContentContainer scalable>
            <Content />
          </Layout.AppContentContainer>
        </Layout.AppScalableContainer>
      :
        <Layout.AppScalableContainer horizontal>
          <Layout.AppHeaderContainer horizontal>
            <AdminNavigation />
          </Layout.AppHeaderContainer>
          <Layout.AppContentContainer horizontal scalable>
            <Content />
          </Layout.AppContentContainer>
        </Layout.AppScalableContainer>
      }
    </Layout.AppContainer>
  );
}

export default App;
