import { supabase } from '../lib/supabase.js';

/**
 * 알림 생성
 */
export const createNotification = async ({
  userId,
  senderId,
  type,
  postId,
  commentId,
  content,
}) => {
  const { error } = await supabase.from('notifications').insert([
    {
      user_id: userId,
      sender_id: senderId,
      type,
      post_id: postId,
      comment_id: commentId,
      content,
    },
  ]);

  if (error) throw error;
};

/**
 * 특정 유저의 알림 목록 조회
 */
export const getNotifications = async (userId) => {
  const { data, error } = await supabase
    .from('notifications')
    .select(
      `
      id,
      created_at,
      user_id,
      sender_id,
      type,
      post_id,
      is_read,
      content,
      sender:profiles!notifications_sender_id_fkey(username, avatar_url)
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * 알림 읽음 처리
 */
export const markAsRead = async (notificationId) => {
  const { error } = await supabase
    .from('notifications')
    .update({
      is_read: true,
    })
    .eq('id', notificationId);

  if (error) throw error;
};
