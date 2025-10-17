import React, {useContext, useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {AppDispatchContext, AppStateContext} from "../App.jsx";
import {ArrowLeft} from "lucide-react";
import PostEditor from "../components/PostEditor.jsx";

const Edit = () => {
  const {id} = useParams();
  const {posts} = useContext(AppStateContext);
  const {onUpdatePost} = useContext(AppDispatchContext); // 수정 함수
  const nav = useNavigate();

  const targetPost = posts.find((item) => String(item.id) === String(id));

  useEffect(() => {
    if (!targetPost) {
      window.alert('게시글이 없습니다.');
      nav('/', {replace: true});
    }
  }, [id, targetPost, nav]);

  if (!targetPost) {
    return <div>로딩중...</div>;
  }

  const handleSubmit = (input) => {
    onUpdatePost(id, input.title, input.content, input.category);
    nav(`/post/${id}`, {replace: true});
  };

  return (
      <div className="max-w-2xl mx-auto p-12">
        <button className="flex items-center gap-2 text-gray-500 mb-8 hover:text-blue-600 transition-colors"
                onClick={() => {
                  if (window.confirm("작성 중인 내용이 사라집니다. 이동하시겠습니까?")) {
                    nav('/')
                  }
                }}
        >
          <ArrowLeft size={20}/> 목록으로 돌아가기
        </button>
        <h2 className="text-3xl font-extrabold mb-8">글 수정하기</h2>
        <PostEditor initData={targetPost}
                    submitButtonText="수정 완료하기"
                    onSubmit={handleSubmit}
        />

      </div>
  );
};

export default Edit;