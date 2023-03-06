
import { Navigate, Routes, Route } from "react-router-dom";
import { HomePage, SignInPage } from '@pages';
import styled, { ThemeProvider } from 'styled-components';
import { useAppSelector } from "@hooks";
import { Header, Footer } from "@components";
import useTryLogin from "./hooks/useTryLogin";
import SignUpPage from "./pages/SignUpPage";
import ColorScheme from "./constants/ColorScheme";

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  text-align: center;
  min-height: 100vh;
  flex-direction: column;
  font-size: 1.0em;
  align-items: stretch;
  justify-content: stretch;
  background-color: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.foreground};
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: stretch;
  justify-items: center;
  min-height: 100vh;
  padding-top: 56px;
  color: ${props => props.theme.colors.foreground};
  background-color: ${props => props.theme.colors.background};
`;

function App() {
  const { themeMode } = useAppSelector(state => state.theme);
  const { userTokens } = useAppSelector(state => state.session);
  const { isLoading, isError, tryLogin } = useTryLogin();

  if (isLoading) {
    return <div>Loading</div>
  }

  if (isError) {
    return <div><button onProgress={tryLogin}></button></div>
  }

  const isAuthenticated = userTokens.refresh_token && userTokens.access_token ? true : false;

  return (
    <ThemeProvider theme={themeMode === 'dark' ? ColorScheme.DarkTheme : ColorScheme.LightTheme}>
      <AppContainer>
        {isAuthenticated ? <Header/> : null}
        <ContentContainer style={{paddingTop: isAuthenticated ? 56 : 0}}>
          <Routes>
            <Route path="/" element={isAuthenticated ? <HomePage/> : <Navigate to={'/sign_in'}/>} />
            <Route path="/hi" element={isAuthenticated ? <p>Hello world</p> : <Navigate to={'/sign_in'}/>} />
            <Route path="/sign_in" element={isAuthenticated ? <Navigate to={'/'} /> : <SignInPage/>} />
            <Route path="/sign_up" element={isAuthenticated ? <Navigate to={'/'} /> : <SignUpPage/>} />
            <Route path="*" element={<p>404</p>} />
          </Routes>
        </ContentContainer>
        {isAuthenticated ? <Footer/> : null}
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
