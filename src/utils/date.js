import { format, formatDistanceToNow, isAfter, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';

export const formatRelativeTime = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);

  // 7일 이내면 '방금 전', '3분 전' 등 상대 시간 표시
  if (isAfter(date, subDays(now, 7))) {
    return formatDistanceToNow(date, {
      addSuffix: true, // '전' 또는 '후' 붙이기
      locale: ko, // 한국어 설정
    }).replace('약 ', ''); // '약 1시간 전'에서 '약' 제거
  }

  // 7일이 넘어가면 날짜 포맷으로 표시
  return format(date, 'yyyy. MM. dd', { locale: ko });
};
