// App.jsx — 라우터 설정
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import JobDetailPage from './pages/JobDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import CreateJobPage from './pages/CreateJobPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            {/* TabBar 없는 페이지 */}
            <Route path="/posts/:postId" element={
              <div className="page-container"><div className="film-grain" /><PostDetailPage /></div>
            } />
            <Route path="/jobs/:jobId" element={
              <div className="page-container"><div className="film-grain" /><JobDetailPage /></div>
            } />
            <Route path="/posts/create" element={
              <div className="page-container"><div className="film-grain" /><CreatePostPage /></div>
            } />
            <Route path="/jobs/create" element={
              <div className="page-container"><div className="film-grain" /><CreateJobPage /></div>
            } />
            <Route path="/login" element={
              <div className="page-container"><div className="film-grain" /><LoginPage /></div>
            } />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
