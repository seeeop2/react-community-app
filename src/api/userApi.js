import { supabase } from '../lib/supabase';

// 활성화된 유저 프로필 목록 조회
export const getProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('status', 'active');

  if (error) {
    throw error;
  }
  return data;
};

// 특정 유저 프로필 조회
export const getProfileById = async (id) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }
  return data;
};

// 프로필 정보 업데이트 (닉네임, 소개 등)
export const updateProfile = async (id, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

export const uploadAvatar = async (userId, file, oldUrl) => {
  const BUCKET_NAME = 'react_community';

  // 기존 이미지가 있다면 삭제 실행
  if (oldUrl) {
    try {
      // URL에서 버킷명 이후의 전체 경로 추출
      const urlParts = oldUrl.split(`${BUCKET_NAME}/`);

      if (urlParts.length > 1) {
        // 뒤에 붙은 경로를 가져오고, 혹시 모를 쿼리스트링(?t=...) 제거
        const fullPath = urlParts[1].split('?')[0];

        // 전체 경로를 배열에 넣어 삭제 요청
        const { error } = await supabase.storage
          .from(BUCKET_NAME)
          .remove([fullPath]);

        if (error) {
          throw error;
        }
        console.log('기존 파일 실제 삭제 완료:', fullPath);
      }
    } catch (error) {
      // 삭제 실패는 업로드를 막을 정도의 치명적 에러는 아니므로 로그만 남김
      console.error('기존 파일 삭제 실패:', error);
    }
  }

  // 새 이미지 업로드 준비
  const fileExt = file.name.split('.').pop();
  const filePath = `profiles/${userId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(`${BUCKET_NAME}`)
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  // 새 공개 URL 반환
  const { data } = supabase.storage
    .from(`${BUCKET_NAME}`)
    .getPublicUrl(filePath);
  return data.publicUrl;
};
