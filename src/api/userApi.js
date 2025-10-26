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
