import toast from 'react-hot-toast';

export const handleError = (message, error) => {
  // 시스템 로그: 디버깅을 위해 상세 에러를 콘솔에 기록
  console.error(`[ERROR] ${message}:`, error);

  // UI 피드백: 사용자에게 에러 상황을 알림
  const friendlyMessage = error?.message || '잠시 후 다시 시도해주세요.';
  toast.error(`${message}\n${friendlyMessage}`, {
    id: message,
  });
};
