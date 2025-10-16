import React, {useContext, useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {AppDispatchContext, AppStateContext} from "../App.jsx";
import {CATEGORY_MAP} from "../constants/categories.js";
import {ArrowLeft, Calendar, Edit3, Tag, Trash2} from "lucide-react";

const PostDetail = () => {
  const {id} = useParams();
  const {posts} = useContext(AppStateContext);
  const {onDeletePost} = useContext(AppDispatchContext);
  const nav = useNavigate();

  const post = posts.find((post) =>
      String(post.id) === id
  );

  useEffect(() => {
    if (!post) {
      window.alert('존재하지 않는 게시글입니다.');
      nav('/', {replace: true});
    }
  }, [id, nav]);

  if (!post) {
    return null;
  }

  const formattedDate = new Date(post.date).toLocaleDateString("ko-KR", {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const onClickDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까? 삭제된 글은 복구할 수 없습니다.")) {
      onDeletePost(post.id);
      nav("/", {replace: true});
    }
  };

  return (
      <div className="max-w-2xl mx-auto p-12">
        <button className="flex items-center gap-2 text-gray-500 mb-8 hover:text-blue-600 transition-colors"
                onClick={() => nav('/')}
        >
          <ArrowLeft size={20}/> 목록으로 돌아가기
        </button>

        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
            <div className="flex items-center gap-1.5 font-bold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">
              <Tag size={14}/> {CATEGORY_MAP[post.category]}
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <Calendar size={14}/> {formattedDate}
            </div>
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap min-h-[300px]">
            {post.content}
          </div>

          <div className="flex justify-end gap-3 mt-12 pt-8 border-t border-gray-100">
            <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
                onClick={() =>
                    nav(`/edit/${post.id}`)
                }
            >
              <Edit3 size={16}/> 수정
            </button>
            <button
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all"
                onClick={onClickDelete}
            >
              <Trash2 size={16}/> 삭제
            </button>

          </div>
        </div>
      </div>
  );
};

export default PostDetail;
