// 허용된 MIME 타입 리스트
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
];

// 파일 사이즈 제한
export const FILE_SIZE_LIMIT = 10 * 1024 * 1024;

// 이미지 압축 옵션 (공통 설정)
export const DEFAULT_COMPRESSION_OPTIONS = {
  maxSizeMB: 1, // 최대 용량 1MB로 압축
  maxWidthOrHeight: 800, // 가로세로 최대 800px (프로필용)
  useWebWorker: true, // 웹 워커 사용하여 메인 스레드 방해 금지
};
