import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import New from './pages/New.jsx';
import PostDetail from './pages/PostDetail.jsx';
import Edit from './pages/Edit.jsx';
import PostProvider from './contexts/PostProvider.jsx';
import UserProvider from './contexts/UserProvider.jsx';
import { AuthProvider } from './contexts/AuthProvider.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <PostProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/new"
              element={
                <ProtectedRoute>
                  <New />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post/:id"
              element={
                <ProtectedRoute>
                  <PostDetail />
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

            {/* 404 페이지 */}
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </PostProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
