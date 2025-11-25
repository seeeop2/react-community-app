import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as notificationApi from '../../api/notificationApi.js';

const useMarkAsRead = (userId) => {
  const queryClient = useQueryClient();

  // 알림 읽음 처리
  return useMutation({
    mutationFn: (notificationId) => notificationApi.markAsRead(notificationId),
    onSuccess: () => {
      // 읽음 처리 후 알림 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
    },
  });
};

export default useMarkAsRead;
