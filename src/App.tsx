
import { Navigate, Routes, Route } from "react-router-dom";
import { ComicDetailPage, ComicPage, ErrorPage, HomePage, LoadingPage, PlanPage, SignInPage } from '@pages';
import styled from 'styled-components';
import { useAppSelector } from "@hooks";
import { Header, Footer } from "@components";
import useTryLogin from "./hooks/useTryLogin";
import SignUpPage from "./pages/SignUpPage";
import ReadingPage from "./pages/ReadingPage";

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
  const { userTokens } = useAppSelector(state => state.session);
  const { isLoading, isError, tryLogin } = useTryLogin();

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

  return (
    <ScrollView id="rootScrollable">
      <Container>
        {isAuthenticated ? <Header/> : null}
        <Content>
          <Routes>
            <Route path="/" element={isAuthenticated ? <HomePage/> : <Navigate to={'/sign_in'}/>} />
            <Route path="/comics" element={isAuthenticated ? <ComicPage /> : <Navigate to={'/sign_in'}/>}></Route>
            <Route path="/comics/:comic_id" element={isAuthenticated ? <ComicDetailPage/> : <Navigate to={'/sign_in'}/>} />
            <Route path="/comics/:comic_id/chapters/:chapter_id" element={isAuthenticated ? <ReadingPage/> : <Navigate to={'/sign_in'}/>} />
            <Route path="/plans" element={isAuthenticated ? <PlanPage /> : <Navigate to={'/sign_in'}/>}></Route>
            <Route path="/sign_in" element={isAuthenticated ? <Navigate to={'/'} /> : <SignInPage/>} />
            <Route path="/sign_up" element={isAuthenticated ? <Navigate to={'/'} /> : <SignUpPage/>} />
            <Route path="*" element={<p>404</p>} />
          </Routes>
        </Content>
        {isAuthenticated ? <Footer/> : null}
      </Container>
    </ScrollView>
  );
}

export default App;
