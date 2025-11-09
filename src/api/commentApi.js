import {supabase} from '../lib/supabase.js';

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
