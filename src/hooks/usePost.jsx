import {useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {AppStateContext} from "../App.jsx";

const usePost = (id) => {
  const {posts} = useContext(AppStateContext);
  const nav = useNavigate();

  const post = posts.find((p) => String(p.id) === String(id));
  const isInvalid = !post || post.isDeleted;

  useEffect(() => {
    if (isInvalid) {
      window.alert('존재하지 않거나 삭제된 게시글입니다.');
      nav('/', {replace: true});
    }
  }, [isInvalid, nav]);

  return post;
};

export default usePost;
