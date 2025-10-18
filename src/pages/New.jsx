import React, {useContext} from 'react';
import {useNavigate} from "react-router-dom";
import {AppDispatchContext} from "../App.jsx";
import {ArrowLeft} from "lucide-react";
import PostEditor from "../components/PostEditor.jsx";
import Button from "../components/Button.jsx";

const New = () => {
  const {onCreatePost} = useContext(AppDispatchContext);
  const nav = useNavigate();

  const handleSubmit = (input) => {
    onCreatePost({...input, userId: 1});
    nav("/", {replace: true});
  };

  const handleCancel = () => {
    if (window.confirm("작성 중인 내용이 사라집니다. 목록으로 돌아갈까요?")) {
      nav('/')
    }
  }

  return (
      <div className="max-w-2xl mx-auto p-12">
        <Button variant="ghost"
                onClick={handleCancel}
                className="mb-8"
        >
          <ArrowLeft size={20}/> 목록으로 돌아가기
        </Button>

        <h2 className="text-3xl font-extrabold mb-8">새 글 쓰기</h2>
        <PostEditor submitButtonText="작성 완료하기"
                    onSubmit={handleSubmit}
        />
      </div>
  );
};

export default New;