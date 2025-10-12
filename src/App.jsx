import './App.css'
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Notfound from "./pages/Notfound.jsx";
import {useRef, useState} from "react";

const mockPosts = [
  {
    id: 1,
    title: "게시글 1",
    userId: 1,
    date: new Date("2026-03-09").getTime(),
    category: "공지"
  },
  {
    id: 2,
    title: "게시글 2",
    userId: 2,
    date: new Date("2026-03-10").getTime(),
    category: "정보"
  },
  {
    id: 3,
    title: "게시글 3",
    userId: 3,
    date: new Date("2026-03-11").getTime(),
    category: "잡담"
  },
]

const mockUsers = [
  {
    id: 1,
    name: "운영자",
    isActive: true,
  },
  {
    id: 2,
    name: "사용자2",
    isActive: true,
  },
  {
    id: 3,
    name: "사용자3",
    isActive: true,
  },
  {
    id: 4,
    name: "사용자4",
    isActive: false,
  },
];

function App() {
  const [posts, setPosts] = useState(mockPosts);
  const [users, setUsers] = useState(mockUsers);
  const idRef = useRef(4);

  const onCreate = (title, author, category) => {
    const newPost = {
      id: idRef.current++,
      title: title,
      author: author,
      date: new Date().getTime(),
      category: category,
    }
    setPosts([newPost, ...posts])
  }

  const onUpdate = (targetId, title) => {
    setPosts(posts.map((post) =>
        post.id === targetId ? {...post, title} : post
    ))
  }

  const onDelete = (targetId) => {
    setPosts(posts.filter((post) =>
        post.id !== targetId
    ))
  }

  return (
      <>
        <button onClick={() => onCreate("test", "운영자", "공지")}>
          게시글 추가 테스트
        </button>
        <button onClick={() => onUpdate(1, "게시글 수정 테스트")}>
          게시글 수정 테스트
        </button>
        <button onClick={() => onDelete(1)}>
          게시글 삭제 테스트
        </button>
        <Routes>
          <Route path="/" element={<Home posts={posts} users={users}/>}/>
          <Route path="/*" element={<Notfound/>}/>
        </Routes>
      </>
  )
}

export default App
