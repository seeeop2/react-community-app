import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as userApi from '../../api/userApi.js';
import { handleError } from '../../utils/errorHandler.js';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // 이미지 업로드와 프로필 업데이트를 순차적으로 처리
    mutationFn: async ({
      userId,
      formData,
      selectedFile,
      currentAvatarUrl,
    }) => {
      let finalAvatarUrl = currentAvatarUrl;

      // 이미지 업로드 (선택된 파일이 있을 때만)
      if (selectedFile) {
        finalAvatarUrl = await userApi.uploadAvatar(
          userId,
          selectedFile,
          currentAvatarUrl
        );
      }

      // DB 업데이트
      return userApi.updateProfile(userId, {
        ...formData,
        avatar_url: finalAvatarUrl,
      });
    },
    onSuccess: (data, variables) => {
      // 내 정보와 게시글 목록 캐시 모두 무효화
      queryClient.invalidateQueries({
        queryKey: ['profile', variables.userId],
      });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (err) => handleError('프로필 저장에 실패했습니다.', err),
  });
};
