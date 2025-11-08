import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as postApi from '../../api/postApi.js';
import { handleError } from '../../utils/errorHandler.js';
import useAuth from '../useAuth.js';

const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (err) => handleError('게시글 저장에 실패했습니다.', err),
  });
};

export default useCreatePost;
