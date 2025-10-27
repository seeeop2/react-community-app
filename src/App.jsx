import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Notfound from './pages/Notfound.jsx';
import New from './pages/New.jsx';
import PostDetail from './components/PostDetail.jsx';
import Edit from './pages/Edit.jsx';
import PostProvider from './context/PostProvider.jsx';
import UserProvider from './context/UserProvider.jsx';
import { AuthProvider } from './context/AuthProvider.jsx';
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
            <Route path="/*" element={<Notfound />} />
          </Routes>
        </PostProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
