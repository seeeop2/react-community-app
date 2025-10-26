import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Notfound from './pages/Notfound.jsx';
import New from './pages/New.jsx';
import PostDetail from './components/PostDetail.jsx';
import Edit from './pages/Edit.jsx';
import PostProvider from './context/PostProvider.jsx';
import UserProvider from './context/UserProvider.jsx';

function App() {
  return (
    <>
      <UserProvider>
        <PostProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<New />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/*" element={<Notfound />} />
          </Routes>
        </PostProvider>
      </UserProvider>
    </>
  );
}

export default App;
