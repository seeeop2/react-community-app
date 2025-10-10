import React from 'react';
import PostItem from "./PostItem.jsx";

const PostList = ({
  posts,
  searchComponent
}) => {
  return (
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100">
        {searchComponent && (
            <div className="p-6 border-b border-slate-50">
              {searchComponent}
            </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">제목</th>
              <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">작성자</th>
              <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">관리</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
            {posts.map((post) => (
                <PostItem key={post.id}
                          post={post}
                />
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default PostList;