import {Navigate, Routes, Route} from 'react-router-dom';
import {
  ResetPasswordPage,
  SendVerificationCodePage,
  SignInPage,
  SignUpPage,
} from '@pages';
import {useAppSelector} from '@hooks';

function SessionRoutes() {
  const { userTokens, currentRole } = useAppSelector(state => state.session);

  const isAuthenticated = !!(userTokens.refresh_token && userTokens.access_token);
  const isAdmin = currentRole !== 0;

  return (
    <Routes>
      <Route path="/sign-in" element={isAuthenticated ? (isAdmin ? <Navigate to={'/admin/profile'} /> : <Navigate to={'/'} />) : <SignInPage/>} />
      <Route path="/sign-up" element={isAuthenticated ? (isAdmin ? <Navigate to={'/admin/profile'} /> : <Navigate to={'/'} />) : <SignUpPage/>} />
      <Route path="/reset-password" element={isAuthenticated ? (isAdmin ? <Navigate to={'/admin/profile'} /> : <Navigate to={'/'} />) : <SendVerificationCodePage/>} />
      <Route path="/reset-password/:email" element={isAuthenticated ? (isAdmin ? <Navigate to={'/admin/profile'} /> : <Navigate to={'/'} />) : <ResetPasswordPage/>} />
      <Route path="/sign-in" element={isAuthenticated ? (isAdmin ? <Navigate to={'/admin/profile'} /> : <Navigate to={'/'} />) : <SignInPage/>} />
    </Routes>
  );
}

export default SessionRoutes;
