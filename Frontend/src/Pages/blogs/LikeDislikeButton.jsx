import React, { useEffect, useState } from 'react';
import { AiFillLike, AiOutlineLike, AiFillDislike, AiOutlineDislike } from 'react-icons/ai';
import {motion} from 'framer-motion'
import apiBlogs from '@/Axios/Blogapi';

function LikeDislikeButton({ postId, like_count, unlike_count, onChangeReactions }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(like_count);
  const [unlikeCount, setUnlikeCount] = useState(unlike_count);

  useEffect(() => {
    const fetchPostReaction = async () => {
      try {
        const res = await apiBlogs.get(`post-reaction/${postId}/`);
        const { is_like } = res.data;
        if (is_like === true){
          setLiked(true)
        }else if (is_like === false){
          setDisliked(true)
        }
      } catch (e) {
        console.log('reaction fetch err', e);
      }
    };
    fetchPostReaction();
  }, []);

  const handleLike = async () => {
    if (disliked) {
      setDisliked(false);
      setUnlikeCount((prev) => Math.max(0, prev - 1));
    }

    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => newLiked ? prev + 1 : Math.max(0, prev - 1));
    onChangeReactions?.(newLiked);

    try {
      await apiBlogs.post(`handle-like/${postId}/like/`);
    } catch (e) {
      console.log(e?.response);
    }
  };

  const handleDislike = async () => {
    if (liked) {
      setLiked(false);
      setLikeCount((prev) => Math.max(0, prev - 1));
    }

    const newDisliked = !disliked;
    setDisliked(newDisliked);
    setUnlikeCount((prev) => newDisliked ? prev + 1 : Math.max(0, prev - 1));
    onChangeReactions?.(newDisliked);

    try {
      await apiBlogs.post(`handle-like/${postId}/dislike/`);
    } catch (e) {
      console.log(e?.response);
    }
  };

  return (
    <div className="flex gap-3 items-center">
      <motion.button
        whileTap={{ scale: 1.2 }}
        onClick={handleLike}
        className={`flex items-center gap-1 text-xl transition-colors duration-300 ${liked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-400'}`}
      >
        {liked ? <AiFillLike /> : <AiOutlineLike />}
        <span>{likeCount}</span>

      </motion.button>

      <motion.button
        whileTap={{ scale: 1.2 }}
        onClick={handleDislike}
        className={`flex items-center gap-1 text-xl transition-colors duration-300 ${disliked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`}
      >
        {disliked ? <AiFillDislike /> : <AiOutlineDislike />}
        <span>{unlikeCount}</span>
      </motion.button>
    </div>
  );
};

export default LikeDislikeButton