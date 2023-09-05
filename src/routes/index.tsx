import {Navigate, Routes, Route} from 'react-router-dom';
import {
  AuthorDetailMNPage,
  ComicDetailPage,
  AuthorMNPage,
  ComicPage,
  HomePage,
  IntroductionPage,
  PlanPage,
  ResetPasswordPage,
  SendVerificationCodePage,
  SignInPage,
  SignUpPage,
  UserProfilePage,
  ReadingPage,
  PlanMNPage,
  UserMNPage,
  FeedbackPage,
  FeedbackMNPage,
  ComicDetailMNPage,
  PolicyAndTermsPage,
  ComicMNPage,
  CategoryMNPage,
  ReportMNPage,
  DocumentMNPage,
  NotFoundPage
} from '@pages';
import {useAppSelector} from '@hooks';
import {Text} from '@components';

function AppRoutes() {
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
      <Route path="/" element={isAuthenticated ? (!isAdmin ? <HomePage/> : <Text>403</Text>) : <Navigate to={'/sign-in'}/>} />
      <Route path="/comics" element={isAuthenticated ? (!isAdmin ? <ComicPage /> : <Text>403</Text>) : <Navigate to={'/sign-in'}/>}></Route>
      <Route path="/comics/stars" element={isAuthenticated ? (!isAdmin ? <ComicPage /> : <Text>403</Text>) : <Navigate to={'/sign-in'}/>}></Route>
      <Route path="/comics/categories" element={isAuthenticated ? (!isAdmin ? <ComicPage /> : <Text>403</Text>) : <Navigate to={'/sign-in'}/>}></Route>
      <Route path="/comics/release-dates" element={isAuthenticated ? (!isAdmin ? <ComicPage /> : <Text>403</Text>) : <Navigate to={'/sign-in'}/>}></Route>
      <Route path="/comics/searching" element={isAuthenticated ? (!isAdmin ? <ComicPage /> : <Text>403</Text>) : <Navigate to={'/sign-in'}/>}></Route>
      <Route path="/comics/filter" element={isAuthenticated ? (!isAdmin ? <ComicPage /> : <Text>403</Text>) : <Navigate to={'/sign-in'}/>}></Route>
      <Route path="/comics/detail/:comicSlug" element={isAuthenticated ? (!isAdmin ? <ComicDetailPage/> : <Text>403</Text>) : <Navigate to={'/sign-in'}/>} />
      <Route path="/comics/detail/:comicSlug/chapters/:chapterId" element={isAuthenticated ? (!isAdmin ? <ReadingPage/> : <Text>403</Text>) : <Navigate to={'/sign-in'}/>} />
      <Route path="/plans" element={isAuthenticated ? (!isAdmin ? <PlanPage /> : <Text>403</Text>) : <Navigate to={'/sign-in'}/>}></Route>
      <Route path="/profile" element={isAuthenticated ? (!isAdmin ? <UserProfilePage /> : <Text>403</Text>) : <Navigate to={'/sign-in'}/>}></Route>
      <Route path="/introduction" element={isAuthenticated ? (!isAdmin ? <IntroductionPage /> : <Text>403</Text>) : <Navigate to={'/sign-in'}/>}></Route>
      <Route path="/policy-and-terms" element={isAuthenticated ? (!isAdmin ? <PolicyAndTermsPage /> : <Text>403</Text>) : <Navigate to={'/sign-in'}/>}></Route>
      <Route path="/feedbacks" element={isAuthenticated ? (!isAdmin ? <FeedbackPage /> : <Text>403</Text>) : <Navigate to={'/sign-in'}/>}></Route>
      <Route path="/sign-in" element={isAuthenticated ? (isAdmin ? <Navigate to={'/admin/profile'} /> : <Navigate to={'/'} />) : <SignInPage/>} />
      <Route path="/sign-up" element={isAuthenticated ? (isAdmin ? <Navigate to={'/admin/profile'} /> : <Navigate to={'/'} />) : <SignUpPage/>} />
      <Route path="/reset-password" element={isAuthenticated ? (isAdmin ? <Navigate to={'/admin/profile'} /> : <Navigate to={'/'} />) : <SendVerificationCodePage/>} />
      <Route path="/reset-password/:email" element={isAuthenticated ? (isAdmin ? <Navigate to={'/admin/profile'} /> : <Navigate to={'/'} />) : <ResetPasswordPage/>} />
      <Route path="/sign-in" element={isAuthenticated ? (isAdmin ? <Navigate to={'/admin/profile'} /> : <Navigate to={'/'} />) : <SignInPage/>} />
      <Route path="*" element={isAuthenticated ? (!isAdmin ? <NotFoundPage /> : <p>404</p>) : <Navigate to={'/sign-in'} />} />
    </Routes>
  );
}

export default AppRoutes;
