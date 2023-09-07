import {Navigate, Routes, Route} from 'react-router-dom';
import {
  ComicDetailPage,
  ComicPage,
  HomePage,
  IntroductionPage,
  PlanPage,
  UserProfilePage,
  ReadingPage,
  FeedbackPage,
  PolicyAndTermsPage,
} from '@pages';
import {useAppSelector} from '@hooks';
import {Text} from '@components';

function UserRoutes() {
  const { userTokens, currentRole } = useAppSelector(state => state.session);

  const isAuthenticated = !!(userTokens.refresh_token && userTokens.access_token);
  const isAdmin = currentRole !== 0;

  return (
    <Routes>
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
    </Routes>
  );
}

export default UserRoutes;
