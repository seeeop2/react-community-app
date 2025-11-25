import { useQuery } from '@tanstack/react-query';
import * as notifyApi from '../../api/notificationApi.js';

export const useNotifications = (userId) => {
  // 알림 목록 가져오기
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: () => notifyApi.getNotifications(userId),
    enabled: !!userId, // 로그인이 되어 있을 때만 실행
  });

  // 안 읽은 알림 개수 계산
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return {
    notifications,
    isLoading,
    unreadCount,
  };
};
