import { supabase } from '../lib/supabase';

// 데이터 전체 조회
export const getPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
    *,
    author:profiles(username, role)
    `
    )
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });
  if (error) {
    throw error;
  }
  return data;
};

// 데이터 하나 조회
export const getPostById = async (id) => {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    throw error;
  }
  return data;
};

// 게시글 생성 (Create)
export const createPost = async (postData) => {
  const { data, error } = await supabase
    .from('posts')
    .insert([postData])
    .select();
  if (error) {
    throw error;
  }
  return data;
};

// 게시글 수정 (Update)
export const updatePost = async (id, updatedFields) => {
  const { data, error } = await supabase
    .from('posts')
    .update(updatedFields)
    .eq('id', id)
    .select();
  if (error) {
    throw error;
  }
  return data;
};

// 게시글 삭제 (Soft Delete - is_deleted를 true로 변경)
export const softDeletePost = async (id) => {
  const { data, error } = await supabase
    .from('posts')
    .update({ is_deleted: true })
    .eq('id', id)
    .select();
  if (error) {
    throw error;
  }
  return data;
};
