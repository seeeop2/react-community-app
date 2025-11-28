import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import New from './pages/New.jsx';
import PostDetail from './pages/PostDetail.jsx';
import Edit from './pages/Edit.jsx';
import { AuthProvider } from './contexts/AuthProvider.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import Profile from './pages/Profile.jsx';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-center" // 위치 설정
        reverseOrder={false}
        toastOptions={{
          duration: 3000, // 3초 동안 표시
          style: {
            borderRadius: '12px',
            background: '#334155',
            color: '#fff',
            fontSize: '14px',
          },
        }}
      />
      <Navbar />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        {/* 누구나 볼 수 있는 페이지 */}
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<PostDetail />} />

        {/* 로그인이 필요한 페이지 */}
        <Route
          path="/new"
          element={
            <ProtectedRoute>
              <New />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <Edit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 페이지 */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
