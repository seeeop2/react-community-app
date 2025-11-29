import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as postApi from '../../api/postApi.js';
import { handleError } from '../../utils/errorHandler.js';

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, fields, selectedFile, currentPreviewUrl }) => {
      let finalImageUrl = fields.image_url;

      // 프리뷰가 없는 경우 (X 버튼을 눌러서 null이 된 상태)
      if (!currentPreviewUrl) {
        finalImageUrl = null;
      }
      // 새 파일을 선택한 경우 (사용자가 사진을 교체한 상태)
      else if (selectedFile) {
        finalImageUrl = await postApi.uploadPostImage(selectedFile);
      }

      //  최종 데이터로 업데이트
      const updateData = {
        title: fields.title,
        category: fields.category,
        content: fields.content,
        image_url: finalImageUrl,
      };

      return postApi.updatePost(id, updateData);
    },
    onSuccess: (data, variables) => {
      // 전체 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      // 특정 게시글 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
    },
    onError: (err) => handleError('게시글 수정에 실패했습니다.', err),
  });
};
