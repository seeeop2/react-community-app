import React, {useContext} from 'react';
import {Edit2, MessageSquare, Trash2} from 'lucide-react';
import {CATEGORY_MAP} from "../constants/categories.js";
import {useNavigate} from "react-router-dom";
import {AppDispatchContext} from "../App.jsx";
import Badge from "./Badge.jsx";

const PostItem = ({
  post,
  users
}) => {
  const {onDeletePost} = useContext(AppDispatchContext);
  const nav = useNavigate();

  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : "알 수 없음"
  }

  const handleNavigateDetail = () => {
    nav(`/post/${post.id}`);
  };

  const handleNavigateEdit = (e) => {
    e.stopPropagation();
    nav(`/edit/${post.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("정말 삭제하시겠습니까? 삭제된 글은 복구할 수 없습니다.")) {
      onDeletePost(post.id);
    }
  };

  return (
      <tr className="group hover:bg-blue-50/30 transition-all cursor-pointer"
          onClick={handleNavigateDetail}
      >
        <td className="px-8 py-5">
          <div className="flex items-center gap-4">
            <div
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"
            >
              <MessageSquare size={18}/>
            </div>
            <div>
              <p className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                {post.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="gray"
                       shape="rounded"
                       size="xxs"
                       fontWeight="bold"
                >
                  {CATEGORY_MAP[post.category]}
                </Badge>
                <span className="text-[10px] text-slate-400">{new Date(post.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </td>
        <td className="px-8 py-5 text-sm font-medium text-slate-600">{getUserName(post.userId)}</td>
        <td className="px-8 py-5">
          <div
              className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300"
          >
            <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    onClick={handleNavigateEdit}
            >
              <Edit2 size={16}/>
            </button>
            <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    onClick={handleDelete}
            >
              <Trash2 size={16}/>
            </button>
          </div>
        </td>
      </tr>
  );
};

export default PostItem;
