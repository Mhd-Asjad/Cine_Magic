import apiBlogs from '@/Axios/Blogapi';
import React, { useEffect , useState } from 'react'
import { useParams } from 'react-router-dom';
import Nav from '@/Components/Navbar/Nav';
import { User , Tag  } from 'lucide-react';
import { useSelector } from 'react-redux';
import LikeDislikeButton from './LikeDislikeButton';
function BlogInfo() {
    const [postDetails , setPostDetails] = useState(null);
    const [comment , setComment] = useState('');
    const [ allComments , setAllComments ] = useState([])
    const [ loading , setLoading] = useState(true)
    const [ liked , isLiked ] = useState(null)
    const {id} = useParams();
    const userId = useSelector((state) => state.user.id)

    
    useEffect(( ) => {
        
        const fetchPostDetails = async() => {
            try{
                const res = await apiBlogs.get(`get-postdetails/${id}/`)
                console.log(res.data)
                setPostDetails(res.data)
                setLoading(false)
            }catch(e) {
            console.log('error while fetch post' , e?.response)
            };
        };
        fetchPostDetails();
    },[liked])
    
    const getComments = async() => {
        try {
            const res = await apiBlogs.get(`create-comment/${id}/`)
            setAllComments(res.data)
        }catch(e){
            console.log(e)
        }
    }
    useEffect(() => {
        getComments()

    },[setComment])


    const handleComment = async() => {
        try{
            const res = await apiBlogs.post(`create-comment/${id}/`, {
                'user' : userId,
                'name' : comment,
                'post' : id
            })
            console.log(res.data?.message)
            setComment('')
        }catch(e){
            console.error('error while comment posting' , e)
        }
    }

    if (loading) {
        return <div className='flex justify-center items-center h-screen'>Loading...</div>
    }


    console.log(liked)
    return(
        <div>
            <Nav/>
        
            <div className="w-full h-screen flex justify-center items-center bg-gray-100 p-4">
            <div className="flex w-[80%] h-[90%] bg-white shadow-lg rounded-lg overflow-hidden">

                <div className="w-2/3 bg-gray-300 bg-gradient-to-b from-transparent via-gray-100 to-black flex flex-col items-center">
                    <h2 className="text-lg font-bold text-gray-900">{postDetails.title}</h2>
                    {/* Post Image */}
                    {postDetails?.images?.length > 0 && (
                        <  >
                        <img
                            src={postDetails.images[0].image}
                            alt={postDetails.title}
                            className="w-[99%] h-[70%] p-2 rounded-lg object-cover"
                        />
                        </>
                    )}

                    {/* Tags, Title & Description */}
                    <div className="w-full p-4 bg-white h-[30%] overflow-y-auto">
                        {/* Author & Title */}
                        <div className="mb-2">
                            <p className="text-sm text-gray-500">by <User className='inline' size={18} /> {postDetails.author_name}</p>
                        </div>

                        {/* Tags */}
                        <div className="mb-2 text-blue-500 flex flex-wrap gap-2">
                            {postDetails.tags.map((tag, index) => (
                                <span key={index} className="text-sm"><Tag className='inline' size={18} />{tag}</span>
                            ))}
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 text-sm">
                            {postDetails?.content}
                        </p>
                        <div className='mt-2' >

                            {/* <LikeDislikeButton postId={postDetails.id} like_count={postDetails.like_count} unlike_count={postDetails.unlike_count} isLiked={isLiked} /> */}
                        </div>
                    </div>
                </div>

                {/* Right side: Comment Section */}
                <div className="w-1/2 flex flex-col border-l">

                    <div className="flex-1 p-4 overflow-y-auto">
                        <h3 className="font-semibold text-center text-xl mb-4"> {allComments.length} Comments....</h3>
        
                        {allComments.length > 0 ? (
                            allComments.map((comment)=> (

                                <div className="mb-3">
                                    <p className="text-sm">
                                        <span className="font-semibold">{comment.username}:</span> {comment.name}
                                    </p>
                                </div>
                            ))
                    
                        ):(
                            <div className="flex items-center justify-center h-96">
                                <div className="flex flex-col items-center justify-center mx-auto text-gray-500">
                                <svg
                                    className="w-16 h-16 mb-4 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9.75 9.75L4.5 4.5m0 0L2.25 6.75m2.25-2.25v12a2.25 2.25 0 002.25 2.25h12a2.25 2.25 0 002.25-2.25v-12a2.25 2.25 0 00-2.25-2.25H6.75z"
                                    />
                                </svg>
                                <h2 className="text-lg font-semibold text-center">No Comments Found...</h2>
                                <p className="text-sm text-gray-400 mt-2 text-center max-w-xs">
                                    Looks like there are no comments available right now. post a comment!
                                </p>
                                </div>
                            </div>
                        )}
                        
                    
                    </div>

                    {/* Add Comment Input */}
                    <div className="border-t p-3 flex items-center">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none"
                        />
                        <button 
                            className="ml-2 text-blue-500 font-semibold"
                            onClick={handleComment}
                        >Post</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )}  

export default BlogInfo
