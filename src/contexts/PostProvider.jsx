import React, {
  createContext,
  useCallback,
  useEffect,
  useReducer,
} from 'react';

import * as postApi from '../api/postApi.js';
import { handleError } from '../utils/errorHandler.js';

export const PostContext = createContext();

const postReducer = (state, action) => {
  switch (action.type) {
    case 'POST/SET_POSTS':
      return action.payload;
    default:
      return state;
  }
};

const PostProvider = ({ children }) => {
  const [posts, dispatch] = useReducer(postReducer, []);

  const fetchPosts = useCallback(async () => {
    try {
      const data = await postApi.getPosts();
      dispatch({
        type: 'POST/SET_POSTS',
        payload: data,
      });
    } catch (error) {
      handleError('데이터 로드에 실패했습니다.', error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = async ({ title, content, category }) => {
    try {
      await postApi.createPost({
        title,
        content,
        category,
        author_id: '7e5dbfde-8074-4e54-8113-838f233c5b88', // 임시로 테스트 유저 고정. TODO: 추후 현재 로그인 유저 정보로 변경
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
