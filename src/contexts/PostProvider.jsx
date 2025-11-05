import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import * as postApi from '../api/postApi.js';
import { handleError } from '../utils/errorHandler.js';
import { AuthContext } from './AuthProvider.jsx';

export const PostContext = createContext();

const postReducer = (state, action) => {
  switch (action.type) {
    case 'POST/SET_POSTS':
      return action.payload;
    case 'POST/APPEND_POSTS': // 기존 목록 뒤에 추가 (다음 페이지)
      return [...state, ...action.payload];
    default:
      return state;
  }
};

const PostProvider = ({ children }) => {
  const [posts, dispatch] = useReducer(postReducer, []);

  const { user } = useContext(AuthContext);

  const fetchPosts = useCallback(async (page = 0) => {
    try {
      const data = await postApi.getPosts(page);

      if (page === 0) {
        dispatch({
          type: 'POST/SET_POSTS',
          payload: data,
        });
      } else {
        dispatch({
          type: 'POST/APPEND_POSTS',
          payload: data,
        });
      }
      return data;
    } catch (error) {
      handleError('데이터 로드에 실패했습니다.', error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = async ({ title, content, category }) => {
    if (!user || !user.id) {
      handleError('로그인이 필요한 서비스입니다.');
      return;
    }

    try {
      await postApi.createPost({
        title,
        content,
        category,
        author_id: user.id,
        is_deleted: false,
      });

      // 서버에 저장이 성공하면 전체 목록을 다시 불러와서 화면 갱신
      await fetchPosts();
    } catch (error) {
      handleError('게시글 저장에 실패했습니다.', error);
      throw error;
    }
  };

  const editPost = async (id, updatedFields) => {
    try {
      await postApi.updatePost(id, updatedFields); // 서버 업데이트
      await fetchPosts(); // 최신 데이터 다시 불러와서 로컬 메모리 갱신
    } catch (error) {
      handleError('게시글 수정에 실패했습니다.', error);
      throw error;
    }
  };

  const removePost = async (id) => {
    try {
      await postApi.softDeletePost(id); // 서버 업데이트
      await fetchPosts(); // 최신 데이터 다시 불러와서 로컬 메모리 갱신
    } catch (error) {
      handleError('게시글 삭제에 실패했습니다.', error);
      throw error;
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        createPost,
        editPost,
        removePost,
        refetch: fetchPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export default PostProvider;
