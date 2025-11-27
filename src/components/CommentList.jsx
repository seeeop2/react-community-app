import React from 'react';
import useComments from '../hooks/queries/useComments.js';
import CommentItem from './CommentItem.jsx';
import CommentItemSkeleton from './skeletons/CommentItemSkeleton.jsx';

const CommentList = ({ postId }) => {
  // Custom Hooks
  const { data: comments, isLoading } = useComments(postId);

  // Early Return
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <CommentItemSkeleton key={i} />
          ))}
      </div>
    );
  }

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
