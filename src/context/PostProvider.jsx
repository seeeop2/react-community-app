import React, {
  createContext,
  useCallback,
  useEffect,
  useReducer,
} from 'react';

import * as postApi from '../api/postApi';

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
      console.error('데이터 로드 실패:', error);
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
        user_id: 1, // 임시로 1로 고정. TODO: 추후 현재 로그인 유저 정보로 변경
        is_deleted: false,
      });

      // 서버에 저장이 성공하면 전체 목록을 다시 불러와서 화면 갱신
      await fetchPosts();
    } catch (error) {
      console.error('게시글 생성 실패:', error);
      alert('게시글 작성 중 오류가 발생했습니다.');
    }
  };

  const editPost = async (id, updatedFields) => {
    try {
      await postApi.updatePost(id, updatedFields); // 서버 업데이트
      await fetchPosts(); // 최신 데이터 다시 불러와서 로컬 메모리 갱신
    } catch (error) {
      console.error('수정 실패:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const removePost = async (id) => {
    try {
      await postApi.softDeletePost(id); // 서버 업데이트
      await fetchPosts(); // 최신 데이터 다시 불러와서 로컬 메모리 갱신
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
      console.error('게시글 삭제 실패:', error);
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
