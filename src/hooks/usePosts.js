import { useContext } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { AuthContext } from '../contexts/AuthProvider.jsx';
import * as postApi from '../api/postApi.js';
import { handleError } from '../utils/errorHandler.js';

const usePosts = () => {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);

  // 게시글 목록 조회 (무한 스크롤)
  const postsQuery = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 0 }) => postApi.getPosts(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      // 페이지당 10개라고 가정할 때, 데이터가 없거나 부족하면 끝
      return !lastPage || lastPage.length < 10 ? undefined : allPages.length;
    },
  });

  // 공통 성공 처리 (서버 데이터를 다시 불러와서 화면 갱신)
  const invalidatePosts = () =>
    queryClient.invalidateQueries({ queryKey: ['posts'] });

  // 게시글 생성
  const createMutation = useMutation({
    mutationFn: (newPost) => {
      if (!user?.id) {
        throw new Error('로그인이 필요합니다.');
      }
      return postApi.createPost({
        ...newPost,
        author_id: user.id,
        is_deleted: false,
      });
    },
    onSuccess: invalidatePosts,
    onError: (err) => handleError('게시글 저장에 실패했습니다.', err),
  });

  // 게시글 수정
  const editMutation = useMutation({
    mutationFn: ({ id, fields }) => postApi.updatePost(id, fields),
    onSuccess: (data, variables) => {
      // 전체 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      // 특정 게시글 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
    },
    onError: (err) => handleError('게시글 수정에 실패했습니다.', err),
  });

  // 게시글 삭제 (Soft Delete)
  const removeMutation = useMutation({
    mutationFn: (id) => postApi.softDeletePost(id),
    onSuccess: invalidatePosts,
    onError: (err) => handleError('게시글 삭제에 실패했습니다.', err),
  });

  return {
    // Data & States
    posts: postsQuery.data?.pages.flat() || [],
    isLoading: postsQuery.isLoading,
    isFetchingNextPage: postsQuery.isFetchingNextPage,
    hasNextPage: postsQuery.hasNextPage,

    // Mutation 상태
    isCreating: createMutation.isPending,
    isEditing: editMutation.isPending,
    isRemoving: removeMutation.isPending,

    // Actions
    fetchNextPage: postsQuery.fetchNextPage,
    createPost: createMutation.mutateAsync,
    editPost: editMutation.mutateAsync,
    removePost: removeMutation.mutateAsync,
    refetch: postsQuery.refetch,
  };
};

export default usePosts;
