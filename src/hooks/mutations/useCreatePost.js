import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as postApi from '../../api/postApi.js';
import { handleError } from '../../utils/errorHandler.js';
import useAuth from '../useAuth.js';

const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ cleanFields, selectedFile }) => {
      if (!user?.id) {
        throw new Error('로그인이 필요합니다.');
      }

      let imageUrl = null;

      // 이미지가 있으면 여기서 먼저 업로드
      if (selectedFile) {
        imageUrl = await postApi.uploadPostImage(selectedFile);
      }

      // 업로드된 URL을 포함해서 DB 저장
      return postApi.createPost({
        ...cleanFields,
        image_url: imageUrl,
        author_id: user.id,
        is_deleted: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts'],
        exact: false,
      });
    },
    onError: (err) => handleError('게시글 저장에 실패했습니다.', err),
  });
};

export default useCreatePost;
