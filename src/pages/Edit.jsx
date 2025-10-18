import React, {useContext, useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {AppDispatchContext, AppStateContext} from "../App.jsx";
import {ArrowLeft} from "lucide-react";
import PostEditor from "../components/PostEditor.jsx";
import Button from "../components/Button.jsx";

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

  const handleCancel = () => {
    if (window.confirm("수정 중인 내용이 사라집니다. 이전 페이지로 돌아갈까요?")) {
      nav(-1)
    }
  }

  return (
      <div className="max-w-2xl mx-auto p-12">
        <Button variant="ghost"
                onClick={handleCancel}
                className="mb-8 px-0"
        >
          <ArrowLeft size={20}/> 이전으로 돌아가기
        </Button>
        <h2 className="text-3xl font-extrabold mb-8">글 수정하기</h2>
        <PostEditor initData={targetPost}
                    submitButtonText="수정 완료하기"
                    onSubmit={handleSubmit}
        />

      </div>
  );
};

export default Edit;