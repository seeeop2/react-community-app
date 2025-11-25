import { supabase } from '../lib/supabase.js';
import * as postApi from './postApi.js';
import { handleError } from '../utils/errorHandler.js';
import * as notificationApi from './notificationApi.js';

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
  // 댓글 생성
  const { data: newComment, error: commentError } = await supabase
    .from('comments')
    .insert([commentData])
    .select()
    .single();

  if (commentError) throw commentError;

  // 알림 로직
  try {
    const post = await postApi.getPostSummaryForNotify(commentData.post_id);

    // 알림 생성 (작성자 본인이 단 댓글은 알림 제외)
    if (post && post.author_id !== commentData.author_id) {
      await notificationApi.createNotification({
        userId: post.author_id,
        senderId: commentData.author_id,
        type: 'comment',
        postId: commentData.post_id,
        commentId: newComment.id,
        content: `"${post.title}" 게시글에 새로운 댓글이 달렸습니다.`,
      });
    }
  } catch (err) {
    handleError('알림 프로세스 중에 오류가 발생했습니다.', err);
  }
  return newComment;
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

/**
 * 댓글 삭제
 */
export const deleteComment = async (id) => {
  const { data, error } = await supabase.from('comments').delete().eq('id', id);

  if (error) {
    throw error;
  }
  return data;
};
