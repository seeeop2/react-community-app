import React, {useState} from 'react';
import StatsCard from "../components/StatsCard.jsx";
import {FileText, Plus, Users, Zap} from "lucide-react";
import Header from "../components/Header.jsx";
import PostList from "../components/PostList.jsx";
import SearchBar from "../components/SearchBar.jsx";

const Home = ({
  posts,
  users
}) => {
  const [keyword, setKeyword] = useState("");
  const todayTime = new Date().setHours(0, 0, 0, 0);

  const filteredPosts = posts.filter(post =>
      post.title.toLowerCase().includes(keyword.toLowerCase())
  );

  const todayPostsCount = posts.filter((post) =>
      post.date >= todayTime
  ).length;

  const activeMemberCount = users.filter((user) =>
      user.isActive
  ).length;

  return (
      <div className="p-12">
        <Header badge="Community"
                title="Company"
                highlightTitle="Board"
                description="자유롭게 의견을 나누는 공간입니다."
                action={
                  <button
                      className="w-full md:w-auto group flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-blue-200"
                  >
                    <Plus size={20}/>
                    새 글 쓰기
                  </button>
                }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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

        <PostList posts={filteredPosts}
                  users={users}
                  searchComponent={<SearchBar onSearch={setKeyword}/>}
        />
      </div>
  );
};

export default Home;
