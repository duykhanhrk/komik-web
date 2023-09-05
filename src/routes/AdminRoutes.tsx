import {Navigate, Routes, Route} from 'react-router-dom';
import {
  AuthorDetailMNPage,
  AuthorMNPage,
  UserProfilePage,
  PlanMNPage,
  UserMNPage,
  FeedbackMNPage,
  ComicDetailMNPage,
  ComicMNPage,
  CategoryMNPage,
  ReportMNPage,
  DocumentMNPage,
  NotFoundPage
} from '@pages';
import {useAppSelector} from '@hooks';

function AdminRoutes() {
  const { userTokens, currentRole } = useAppSelector(state => state.session);

  const isAuthenticated = !!(userTokens.refresh_token && userTokens.access_token);
  const isAdmin = currentRole !== 0;

  return (
    <Routes>
      <Route path="/admin/profile" element={isAuthenticated ? (isAdmin ? <UserProfilePage /> : <NotFoundPage />) : <Navigate to={'/sign-in'} />}/>
      <Route path="/admin/categories" element={isAuthenticated ? (isAdmin ? <CategoryMNPage /> : <NotFoundPage />) : <Navigate to={'/sign-in'} />}/>
      <Route path="/admin/authors" element={isAuthenticated ? (isAdmin ? <AuthorMNPage /> : <NotFoundPage />) : <Navigate to={'/sign-in'} />}/>
      <Route path="/admin/authors/:id" element={isAuthenticated ? (isAdmin ? <AuthorDetailMNPage /> : <NotFoundPage />) : <Navigate to={'/sign-in'} />}/>
      <Route path="/admin/plans" element={isAuthenticated ? (isAdmin ? <PlanMNPage /> : <NotFoundPage />) : <Navigate to={'/sign-in'} />}/>
      <Route path="/admin/users" element={isAuthenticated ? (isAdmin ? <UserMNPage /> : <NotFoundPage />) : <Navigate to={'/sign-in'} />}/>
      <Route path="/admin/feedbacks" element={isAuthenticated ? (isAdmin ? <FeedbackMNPage /> : <NotFoundPage />) : <Navigate to={'/sign-in'} />}/>
      <Route path="/admin/documents" element={isAuthenticated ? (isAdmin ? <DocumentMNPage /> : <NotFoundPage />) : <Navigate to={'/sign-in'} />}/>
      <Route path="/admin/comics" element={isAuthenticated ? (isAdmin ? <ComicMNPage /> : <NotFoundPage />) : <Navigate to={'/sign-in'} />}/>
      <Route path="/admin/comics/:comicId" element={isAuthenticated ? (isAdmin ? <ComicDetailMNPage /> : <NotFoundPage />) : <Navigate to={'/sign-in'} />}/>
      <Route path="/admin/reports" element={isAuthenticated ? (isAdmin ? <ReportMNPage /> : <NotFoundPage />) : <Navigate to={'/sign-in'} />}/>
    </Routes>
  );
}

export default AdminRoutes;
