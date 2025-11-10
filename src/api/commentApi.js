import {supabase} from '../lib/supabase.js';

/**
 * 특정 게시글의 댓글 목록 조회
 */
export const getComments = async (postId) => {
  const { data, error } = await supabase
    .from('comments')
    .select(
      `
      id,
      content,
      created_at,
      is_edited,
      author_id,
      author:profiles(username, avatar_url)
    `
    )
    .eq('post_id', postId)
    .order('created_at', { ascending: true }); // 과거순

  if (error) {
    throw error;
  }
  return data;
};

/**
 * 댓글 작성
 */
export const createComment = async (commentData) => {
  const { data, error } = await supabase
    .from('comments')
    .insert([commentData])
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

/**
 * 댓글 수정
 */
export const updateComment = async (id, content) => {
  const { data, error } = await supabase
    .from('comments')
    .update({
      content,
      is_edited: true,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};
