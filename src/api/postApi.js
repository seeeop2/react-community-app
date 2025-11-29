import { supabase } from '../lib/supabase';
import { DEFAULT_CATEGORY } from '../constants/categories.js';

// 데이터 전체 조회
export const getPosts = async (
  page = 0,
  {
    keyword = '',
    category = DEFAULT_CATEGORY,
    orderBy = 'created_at',
    authorId = null,
  } = {}
) => {
  const ITEMS_PER_PAGE = 10;
  const from = page * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // 기본 쿼리
  let query = supabase
    .from('posts_with_counts')
    .select(
      `
      id, 
      title, 
      category, 
      author_id,
      created_at, 
      is_deleted,
      author,
      comment_count,
      like_count
    `
    )
    .eq('is_deleted', false);

  // 작성자 필터 적용
  if (authorId) {
    query = query.eq('author_id', authorId);
  }

  // 카테고리 필터 적용
  if (category && category !== DEFAULT_CATEGORY) {
    query = query.eq('category', category);
  }

  // 검색어 필터 적용
  if (keyword && keyword.trim()) {
    query = query.ilike('title', `%${keyword}%`);
  }

  // 정렬 및 범위 지정 후 실행
  const { data, error } = await query
    .order(orderBy, { ascending: false })
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
    .from('posts_with_counts')
    .select(
      `
    id, 
    title, 
    content, 
    category, 
    author_id, 
    created_at, 
    is_deleted,
    author,
    image_url
    `
    )
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

// 작성자별 게시글 수 조회
export const getUserPostCount = async (authorId) => {
  const { count, error } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', authorId)
    .eq('is_deleted', false);

  if (error) throw error;
  return count || 0;
};

// 내가 좋아요 한 게시글 총 개수 조회
export const getLikedPostCount = async (userId) => {
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw error;
  return count || 0;
};

// 내가 좋아요 한 게시글 목록 조회
export const getLikedPosts = async (page = 0, userId) => {
  const ITEMS_PER_PAGE = 10;
  const from = page * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // likes 테이블에서 내가 좋아요 한 post_id 목록을 가져온 뒤, posts 테이블과 조인
  const { data, error } = await supabase
    .from('likes')
    .select(
      `
      post_id,
      posts_with_counts (
        id, 
        title, 
        category, 
        author_id, 
        created_at, 
        is_deleted, 
        author, 
        comment_count, 
        like_count
      )
    `
    )
    .eq('user_id', userId)
    .eq('posts_with_counts.is_deleted', false)
    .order('created_at', {
      foreignTable: 'posts_with_counts',
      ascending: false,
    })
    .range(from, to);

  if (error) throw error;

  return data
    .map((item) => item.posts_with_counts)
    .filter((post) => post !== null);
};

// 내가 댓글을 단 게시글 총 개수 조회 (중복 포스트 제외)
export const getCommentedPostCount = async (userId) => {
  const { data, error } = await supabase
    .from('comments')
    .select('post_id')
    .eq('author_id', userId);
  if (error) throw error;

  // Set을 이용해 중복된 post_id 제거 후 개수 반환
  const uniquePostIds = new Set(data.map((item) => item.post_id));
  return uniquePostIds.size;
};

// 내가 댓글을 단 게시글 목록 조회
export const getCommentedPosts = async (page = 0, userId) => {
  const ITEMS_PER_PAGE = 10;
  const from = page * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // 내가 댓글을 단 포스트 목록을 가져옴
  const { data, error } = await supabase
    .from('comments')
    .select(
      `
      post_id,
      posts_with_counts (
        id, 
        title, 
        category, 
        author_id, 
        created_at, 
        is_deleted, 
        author, 
        comment_count, 
        like_count
      )
    `
    )
    .eq('author_id', userId)
    .eq('posts_with_counts.is_deleted', false)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  // post_id 기준으로 중복 제거 후 데이터 정제
  const seen = new Set();
  return data
    .map((item) => item.posts_with_counts)
    .filter((post) => {
      if (!post || seen.has(post.id)) return false;
      seen.add(post.id);
      return true;
    });
};

/**
 * 알림용 게시글 요약 정보 조회
 */
export const getPostSummaryForNotify = async (postId) => {
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
    author_id, 
    title
    `
    )
    .eq('id', postId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * 게시글 이미지 업로드
 */
export const uploadPostImage = async (file) => {
  const fileExt = file.name.split('.').pop();

  // 파일명 중복 방지를 위해 timestamp + random string 조합
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `posts/${fileName}`;

  // Storage에 업로드
  const { error: uploadError } = await supabase.storage
    .from('react_community')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // Public URL 가져오기
  const { data } = supabase.storage
    .from('react_community')
    .getPublicUrl(filePath);

  return data.publicUrl;
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
