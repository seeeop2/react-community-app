import { supabase } from '../lib/supabase.js';

// 특정 게시글의 좋아요 데이터 가져오기
export const getLikesByPostId = async (postId) => {
  const { data, error } = await supabase
    .from('likes')
    .select(
      `
    id, 
    user_id, 
    post_id
    `
    )
    .eq('post_id', postId);

  if (error) {
    console.error('좋아요 조회 중 오류가 발생하였습니다.', error.message);
    throw error;
  }
  return data;
};

// 좋아요 토글 (추가/삭제)
export const toggleLike = async ({ postId, userId, isLiked }) => {
  if (isLiked) {
    // 이미 좋아요를 눌렀다면 삭제
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
    if (error) {
      throw error;
    }
  } else {
    // 안 눌렀다면 추가
    const { error } = await supabase.from('likes').insert({
      post_id: postId,
      user_id: userId,
    });
    if (error) {
      throw error;
    }
  }
};
