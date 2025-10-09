import React from 'react';
import StatsCard from "../components/StatsCard.jsx";
import {FileText, Users, Zap} from "lucide-react";

const Home = ({posts}) => {

  return (
      <div className="p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatsCard
              title="전체 게시글"
              count={posts.length}
              icon={FileText}
              variant="blue"
          />
          <StatsCard
              title="오늘 올라온 글"
              count={2}
              icon={Zap}
              variant="orange"
              highlight={true}
          />
          <StatsCard
              title="활동 멤버"
              count={15}
              icon={Users}
              variant="green"
          />
        </div>
      </div>
  );
};

export default Home;
