import React from 'react';
import useComments from '../hooks/queries/useComments.js';
import CommentItem from './CommentItem.jsx';

const CommentList = ({ postId }) => {
  // Custom Hooks
  const { data: comments, isLoading } = useComments(postId);

  // Early Return 첫 번째 (데이터 로드 전)
  if (isLoading) {
    return (
      <div className="py-10 text-center text-slate-400">
        댓글 불러오는 중...
      </div>
    );
  }

  // Early Return 두 번째 (데이터 로드 후)
  if (!comments?.length) {
    return (
      <div className="py-10 text-center text-sm text-slate-400">
        아직 댓글이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postId={postId} />
      ))}
    </div>
  );
};

export default CommentList;
