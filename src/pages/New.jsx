import React, {useContext, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {AppDispatchContext} from "../App.jsx";
import {ArrowLeft, Send} from "lucide-react";
import {CATEGORY_LIST} from "../constants/categories.js";

const New = () => {
  const [input, setInput] = useState({
    title: "",
    category: "NOTICE",
    content: "",
  });
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const {onCreatePost} = useContext(AppDispatchContext);
  const nav = useNavigate();

  const onChangeInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setInput({
      ...input,
      [name]: value,
    })
  }

  const onSubmit = () => {
    if (!input.title.trim()) {
      window.alert("제목을 입력하세요!");
      titleRef.current.focus();
      return;
    }
    if (!input.content.trim()) {
      window.alert("내용을 입력하세요!");
      contentRef.current.focus();
      return;
    }
    onCreatePost({
      title: input.title,
      content: input.content,
      userId: 1,
      category: input.category,
    });
    nav("/", {replace: true});
  };

  return (
      <div className="max-w-2xl mx-auto p-12">
        <button className="flex items-center gap-2 text-gray-500 mb-8 hover:text-blue-600 transition-colors"
                onClick={() => {
                  if (window.confirm("작성 중인 내용이 사라집니다. 이동하시겠습니까?")) {
                    nav(-1)
                  }
                }}
        >
          <ArrowLeft size={20}/> 목록으로 돌아가기
        </button>

        <h2 className="text-3xl font-extrabold mb-8">새 글 쓰기</h2>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <label className="block text-sm font-semibold mb-2">카테고리</label>
          <select value={input.category}
                  name="category"
                  className="w-full p-4 mb-6 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  onChange={onChangeInput}
          >
            {CATEGORY_LIST.map((category) =>
                <option value={category.value} key={category.value}>
                  {category.label}
                </option>
            )}
          </select>

          <label className="block text-sm font-semibold mb-2">제목</label>
          <input value={input.title}
                 name="title"
                 ref={titleRef}
                 className="w-full p-4 mb-8 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                 onChange={onChangeInput}
                 placeholder="제목을 입력해주세요."
          />

          <label className="block text-sm font-semibold mb-2">본문</label>
          <textarea value={input.content}
                    name="content"
                    ref={contentRef}
                    className="w-full p-4 mb-8 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    rows="10"
                    onChange={onChangeInput}
                    placeholder="내용을 입력해주세요."
          />

          <button
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg"
              onClick={onSubmit}
          >
            <Send size={18}/>
            작성 완료하기
          </button>
        </div>
      </div>
  );
};

export default New;