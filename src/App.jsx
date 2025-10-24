import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Notfound from './pages/Notfound.jsx';
import { createContext, useState } from 'react';
import New from './pages/New.jsx';
import PostDetail from './components/PostDetail.jsx';
import Edit from './pages/Edit.jsx';
import PostProvider from './context/PostProvider.jsx';

const mockPosts = [
  {
    id: 1,
    title: '게시글 1',
    content: '첫 번째 게시글의 본문입니다.',
    userId: 1,
    date: new Date('2026-03-09').getTime(),
    category: 'NOTICE',
    isDeleted: false,
  },
  {
    id: 2,
    title: '게시글 2',
    content: '두 번째 게시글의 본문입니다.',
    userId: 2,
    date: new Date('2026-03-10').getTime(),
    category: 'INFO',
    isDeleted: false,
  },
  {
    id: 3,
    title: '게시글 3',
    content: '세 번째 게시글의 본문입니다.',
    userId: 3,
    date: new Date('2026-03-11').getTime(),
    category: 'CHAT',
    isDeleted: false,
  },
];

const mockUsers = [
  {
    id: 1,
    name: '운영자',
    isActive: true,
  },
  {
    id: 2,
    name: '사용자2',
    isActive: true,
  },
  {
    id: 3,
    name: '사용자3',
    isActive: true,
  },
  {
    id: 4,
    name: '사용자4',
    isActive: false,
  },
];

export const AppStateContext = createContext();

function App() {
  const [state] = useState({
    users: mockUsers,
  });

  return (
    <>
      <AppStateContext.Provider value={state}>
        <PostProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<New />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/*" element={<Notfound />} />
          </Routes>
        </PostProvider>
      </AppStateContext.Provider>
    </>
  );
}

export default App;
