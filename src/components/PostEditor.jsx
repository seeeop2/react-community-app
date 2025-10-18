import React, {useRef, useState} from 'react';
import {CATEGORY_LIST} from "../constants/categories.js";
import {Send} from "lucide-react";
import Button from "./Button.jsx";

const PostEditor = ({
  initData,
  onSubmit,
  submitButtonText,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState(initData || {
    title: "",
    category: "NOTICE",
    content: "",
  });
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  const onChangeInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setInput({
      ...input,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    if (!input.title.trim()) {
      window.alert("제목을 입력하세요!");
      return titleRef.current.focus();
    }
    if (!input.content.trim()) {
      window.alert("내용을 입력하세요!");
      return contentRef.current.focus();
    }

    setIsLoading(true);

    try {
      await onSubmit(input);
    } catch (error) {
      console.error("제출 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <label className="block text-sm font-semibold mb-2">
          카테고리
        </label>
        <select value={input.category}
                name="category"
                className="w-full p-4 mb-6 rounded-xl border border-gray-200"
                onChange={onChangeInput}
        >
          {CATEGORY_LIST.map((category) =>
              <option value={category.value}
                      key={category.value}
              >
                {category.label}
              </option>
          )}
        </select>

        <label className="block text-sm font-semibold mb-2">제목</label>
        <input value={input.title}
               name="title"
               ref={titleRef}
               className="w-full p-4 mb-8 rounded-xl border border-gray-200"
               onChange={onChangeInput}
               placeholder="제목을 입력하세요."
        />

        <label className="block text-sm font-semibold mb-2">본문</label>
        <textarea value={input.content}
                  name="content"
                  ref={contentRef}
                  className="w-full p-4 mb-8 rounded-xl border border-gray-200"
                  rows="10"
                  onChange={onChangeInput}
                  placeholder="내용을 입력하세요."
        />

        <Button fontWeight="bold"
                fullWidth={true}
                loading={isLoading}
                onClick={handleSubmit}
        >
          <Send size={18}/> {submitButtonText}
        </Button>
      </div>
  );
};

export default PostEditor;