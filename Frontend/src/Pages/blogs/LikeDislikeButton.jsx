import React, { useEffect, useState } from 'react';
import { AiFillLike, AiOutlineLike, AiFillDislike, AiOutlineDislike } from 'react-icons/ai';
import {motion} from 'framer-motion'
import apiBlogs from '@/Axios/Blogapi';
import { useSelector } from 'react-redux';
const LikeDislikeButton = ({ postId , like_count , unlike_count , isLiked }) => {
  const [liked, setLiked] = useState(null);
  const userId = useSelector((state) => state.user.id)

  useEffect(() => {
    const fetchPostReaction = async() =>{
      try{
        console.log(userId)
        const res = await apiBlogs.get(`post-reaction/${postId}/`)
        const {is_like} = res.data;
        console.log(is_like , 'post reaction status')
        setLiked(is_like)
      }catch(e){
        console.log('reaction fetch err' , e)
      }
    }
    fetchPostReaction()

  },[ ])  

  const handleLike = async() => {
    if (disliked) {
      setDisliked(false);
      isLiked(false)
    }
    isLiked(!liked)
    setLiked(!liked);
    try {
        const res = await apiBlogs.post(`handle-like/${postId}/like/`,)
        console.log(res.data.message)
    }catch(e){
        console.log(e?.response)
    }
  };


  const handleDislike = async() => {
    try {
        const res = await apiBlogs.post(`handle-like/${postId}/dislike/`)
        console.log(res.data)
    }catch(e){
        console.log(e?.response)
    }
    if (liked) {
      setLiked(false);
      isLiked(false)
    }
    isLiked(disliked)
    setDisliked(!disliked);
    
  };

  return (
    <div className="flex gap-3 items-center">
      <motion.button
        whileTap={{ scale: 1.2 }}
        onClick={handleLike}
        className={`flex items-center gap-1 text-xl transition-colors duration-300 ${
          liked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-400'
        }`}
      >
        {liked ? <AiFillLike /> : <AiOutlineLike />}
        <span>{like_count}</span>
      </motion.button>

      <motion.button
        whileTap={{ scale: 1.2 }}
        onClick={handleDislike}
        className={`flex items-center gap-1 text-xl transition-colors duration-300 ${
          disliked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'
        }`}
      >
        {disliked ? <AiFillDislike /> : <AiOutlineDislike />}
        <span>{ unlike_count}</span>
      </motion.button>
    </div>
  );
};

export default LikeDislikeButton;
