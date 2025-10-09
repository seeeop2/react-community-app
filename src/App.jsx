import './App.css'
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Notfound from "./pages/Notfound.jsx";
import {useState} from "react";

const mockData = [
  {
    id: 1,
    title: "게시글 1",
    author: "운영자",
    date: new Date("2026-03-09").getTime(),
    category: "공지"
  },
  {
    id: 2,
    title: "게시글 2",
    author: "사용자2",
    date: new Date("2026-03-10").getTime(),
    category: "정보"
  },
  {
    id: 3,
    title: "게시글 3",
    author: "사용자3",
    date: new Date("2026-03-11").getTime(),
    category: "잡담"
  },
]

function App() {
  const [posts, setPosts] = useState(mockData);

  return (
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/*" element={<Notfound/>}/>
      </Routes>
  )
}

export default App
