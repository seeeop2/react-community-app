import heic2any from 'heic2any';
import imageCompression from 'browser-image-compression';
import { ALLOWED_IMAGE_TYPES, DEFAULT_COMPRESSION_OPTIONS, FILE_SIZE_LIMIT, } from '../constants/image.js';
import toast from 'react-hot-toast';
import { handleError } from './errorHandler.js';

/**
 * 이미지 파일의 유효성을 검사하고, 필요 시 HEIC 변환 및 압축을 진행합니다.
 */
export const processImageFile = async (selectedFile) => {
  if (!selectedFile) return null;

  const isHEIC =
    selectedFile.name.toLowerCase().endsWith('.heic') ||
    selectedFile.type === 'image/heic';

  // 타입 검사
  if (!ALLOWED_IMAGE_TYPES.includes(selectedFile.type) && !isHEIC) {
    toast.error('JPG, PNG, WebP, HEIC 파일만 업로드 가능합니다.', {
      id: 'img-type',
    });
    return null;
  }

  // 용량 검사
  // 용량 초과 시 알림 이후 종료
  if (selectedFile.size > FILE_SIZE_LIMIT) {
    toast.error(
      `사진은 ${FILE_SIZE_LIMIT / (1024 * 1024)}MB를 초과할 수 없습니다.`,
      { id: 'img-size' }
    );
    return null;
  }

  let processingFile = selectedFile;

  // HEIC 파일인 경우 JPEG로 변환
  if (isHEIC) {
    try {
      const convertedBlob = await heic2any({
        blob: selectedFile,
        toType: 'image/jpeg',
        quality: 0.8,
      });

      // 변환된 Blob을 File 객체로 새로 만듦 (확장자도 .jpg로 교체)
      processingFile = new File(
        [convertedBlob],
        selectedFile.name.replace(/\.[^/.]+$/, '.jpg'),
        { type: 'image/jpeg' }
      );
    } catch (error) {
      handleError('아이폰 이미지(HEIC) 변환 중 오류가 발생했습니다.', error);
      return null;
    }
  }

  // 압축 진행
  try {
    return await imageCompression(processingFile, DEFAULT_COMPRESSION_OPTIONS);
  } catch (error) {
    handleError('이미지 압축 처리 중 오류가 발생했습니다.', error);
    return null;
  }
};
