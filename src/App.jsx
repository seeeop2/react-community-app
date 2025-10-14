import './App.css'
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Notfound from "./pages/Notfound.jsx";
import {createContext, useReducer, useRef} from "react";
import New from "./pages/New.jsx";

const mockPosts = [
  {
    id: 1,
    title: "게시글 1",
    content: "첫 번째 게시글의 본문입니다.",
    userId: 1,
    date: new Date("2026-03-09").getTime(),
    category: "NOTICE"
  },
  {
    id: 2,
    title: "게시글 2",
    content: "두 번째 게시글의 본문입니다.",
    userId: 2,
    date: new Date("2026-03-10").getTime(),
    category: "INFO"
  },
  {
    id: 3,
    title: "게시글 3",
    content: "세 번째 게시글의 본문입니다.",
    userId: 3,
    date: new Date("2026-03-11").getTime(),
    category: "CHAT"
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

export const AppStateContext = createContext();
export const AppDispatchContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'POST/CREATE':
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };
    case 'POST/UPDATE':
      return {
        ...state,
        posts: state.posts.map((post) =>
            post.id === action.payload.targetId ? {...post, title: action.payload.title} : post
        )
      }
    case 'POST/DELETE':
      return {
        ...state,
        posts: state.posts.filter((post) =>
            post.id !== action.payload.targetId
        )
      }
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, {
    posts: mockPosts,
    users: mockUsers,
  })
  const idRef = useRef(4);

  const onCreatePost = ({title, content, userId, category}) => {
    dispatch({
      type: "POST/CREATE",
      payload: {
        id: idRef.current++,
        title,
        content,
        userId,
        date: new Date().getTime(),
        category,
      }
    })
  }

  const onUpdatePost = (targetId, title) => {
    dispatch({
      type: "POST/UPDATE",
      payload: {
        targetId,
        title,
      }
    })
  }

  const onDeletePost = (targetId) => {
    dispatch({
      type: "POST/DELETE",
      payload: {
        targetId,
      }
    })
  }

  return (
      <>
        <AppStateContext.Provider value={state}>
          <AppDispatchContext.Provider value={{
            onCreatePost,
            onUpdatePost,
            onDeletePost,
          }}>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/new" element={<New/>}/>
              <Route path="/*" element={<Notfound/>}/>
            </Routes>
          </AppDispatchContext.Provider>
        </AppStateContext.Provider>
      </>
  )
}

export default App
