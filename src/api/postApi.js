import { supabase } from '../lib/supabase'; // 데이터 전체 조회

// 데이터 전체 조회
export const getPosts = async (page = 0) => {
  const ITEMS_PER_PAGE = 10;
  const from = page * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  const { data, error } = await supabase
    .from('posts')
    .select(
      `
    *,
    author:profiles(username, role)
    `
    )
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .range(from, to);

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

// 전체 게시글 수와 오늘 게시글 수를 한 번에 가져오기
export const getPostStats = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 전체 카운트
  const totalCountPromise = supabase
    .from('posts')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('is_deleted', false);

  // 오늘 카운트
  const todayCountPromise = supabase
    .from('posts')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq('is_deleted', false)
    .gte('created_at', today.toISOString());

  const [totalResponse, todayResponse] = await Promise.all([
    totalCountPromise,
    todayCountPromise,
  ]);

  if (totalResponse.error) {
    throw totalResponse.error;
  }
  if (todayResponse.error) {
    throw todayResponse.error;
  }

  return {
    totalPosts: totalResponse.count,
    todayPosts: todayResponse.count,
  };
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
