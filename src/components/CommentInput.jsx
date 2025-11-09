import React, { useState } from 'react';
import Button from './Button.jsx';
import useCreateComment from '../hooks/mutations/useCreateComment.js';

const CommentInput = ({ postId }) => {
  const [content, setContent] = useState('');
  const { mutateAsync: createComment, isPending: isCreating } =
    useCreateComment(postId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      return;
    }

    try {
      await createComment(content);
      setContent(''); // 작성 성공 시 입력창 비우기
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 transition-all focus-within:border-blue-400 focus-within:bg-white">
        <textarea
          rows="2"
          className="w-full resize-none border-none bg-transparent p-0 text-slate-700 placeholder:text-slate-400 focus:ring-0"
          placeholder="따뜻한 댓글을 남겨주세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="mt-2 flex justify-end">
          <Button
            type="submit"
            size="sm"
            loading={isCreating}
            disabled={!content.trim()}
          >
            댓글 쓰기
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentInput;
