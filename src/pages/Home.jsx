import React, { useState } from 'react';
import StatsCard from '../components/StatsCard.jsx';
import { FileText, Plus, Users, Zap } from 'lucide-react';
import Header from '../components/Header.jsx';
import PostList from '../components/PostList.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import usePosts from '../hooks/usePosts.js';
import useUsers from '../hooks/useUsers.js';

const Home = () => {
  const { posts = [], isLoading: isPostLoading } = usePosts();
  const { users = [], isLoading: isUserLoading } = useUsers();
  const [keyword, setKeyword] = useState('');
  // TODO: 추후 API 단에서 필터링하여 최적화 필요
  const todayTime = new Date().setHours(0, 0, 0, 0);
  const nav = useNavigate();

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(keyword.toLowerCase())
  );

  const todayPostsCount = posts.filter((post) => {
    const postDate = new Date(post.created_at).getTime();
    return postDate >= todayTime;
  }).length;

  const activeMemberCount = users.filter(
    (user) => user.status === 'active'
  ).length;

  if (isPostLoading || isUserLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl p-12">
      <Header
        badge="Community"
        title="Company"
        highlightTitle="Board"
        description="자유롭게 의견을 나누는 공간입니다."
        action={
          <Button
            fontWeight="bold"
            fullWidth={true}
            onClick={() => nav('/new')}
          >
            <Plus size={20} />새 글 쓰기
          </Button>
        }
      />

      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          title="전체 게시글"
          count={posts.length}
          icon={FileText}
          variant="blue"
        />
        <StatsCard
          title="오늘 올라온 글"
          count={todayPostsCount}
          icon={Zap}
          variant="orange"
          highlight={true}
        />
        <StatsCard
          title="활동 멤버"
          count={activeMemberCount}
          icon={Users}
          variant="green"
        />
      </div>

      <PostList
        posts={filteredPosts}
        searchComponent={<SearchBar onSearch={setKeyword} />}
      />
    </div>
  );
};

export default Home;
