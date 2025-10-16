import './App.css'
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Notfound from "./pages/Notfound.jsx";
import {createContext, useReducer, useRef} from "react";
import New from "./pages/New.jsx";
import PostDetail from "./components/PostDetail.jsx";
import Edit from "./pages/Edit.jsx";

const mockPosts = [
  {
    id: 1,
    title: "게시글 1",
    content: "첫 번째 게시글의 본문입니다.",
    userId: 1,
    date: new Date("2026-03-09").getTime(),
    category: "NOTICE",
    isDeleted: false,
  },
  {
    id: 2,
    title: "게시글 2",
    content: "두 번째 게시글의 본문입니다.",
    userId: 2,
    date: new Date("2026-03-10").getTime(),
    category: "INFO",
    isDeleted: false,
  },
  {
    id: 3,
    title: "게시글 3",
    content: "세 번째 게시글의 본문입니다.",
    userId: 3,
    date: new Date("2026-03-11").getTime(),
    category: "CHAT",
    isDeleted: false,
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
            String(post.id) === String(action.payload.targetId)
                ? {
                  ...post,
                  title: action.payload.title,
                  content: action.payload.content,
                  category: action.payload.category,
                }
                : post
        )
      }
    case 'POST/SOFT_DELETE':
      return {
        ...state,
        posts: state.posts.map((post) =>
            String(post.id) === String(action.payload.targetId)
                ? {...post, isDeleted: true}
                : post
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

  const onUpdatePost = (targetId, title, content, category) => {
    dispatch({
      type: "POST/UPDATE",
      payload: {
        targetId,
        title,
        content,
        category
      }
    })
  }

  const onDeletePost = (targetId) => {
    dispatch({
      type: "POST/SOFT_DELETE",
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
              <Route path="/post/:id" element={<PostDetail/>}/>
              <Route path="/edit/:id" element={<Edit/>}/>
              <Route path="/*" element={<Notfound/>}/>
            </Routes>
          </AppDispatchContext.Provider>
        </AppStateContext.Provider>
      </>
  )
}

export default App
