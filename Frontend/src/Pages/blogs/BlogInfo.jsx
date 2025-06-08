import apiBlogs from '@/Axios/Blogapi';
import React, { useEffect , useState } from 'react'
import { useParams } from 'react-router-dom';
import Nav from '@/components/Navbar/Nav';
import { User , Tag , MessageCircle , Calendar , Eye  } from 'lucide-react';
import { useSelector } from 'react-redux';
import LikeDislikeButton from './LikeDislikeButton';
import { Avatar } from '@mui/material';
import {Stack} from '@mui/material';
import Modal from '@/components/Modals/Modal';
import AuthContainer from '../userauth/AuthContainer';
import { Send , Clock1 , Heart , Share2 } from 'lucide-react';
import { getDate, getDay } from 'date-fns';

function BlogInfo() {
    const [postDetails , setPostDetails] = useState(null);
    const [comment , setComment] = useState('');
    const [ allComments , setAllComments ] = useState([])
    const [ loading , setLoading] = useState(true)
    const [reaction , setReaction] = useState(null)
    const [isModalOpen , setIsModalOpen] = useState(false);
    const [isLogin , setIsLogin] = useState(false);
    const {id} = useParams();
    const userId = useSelector((state) => state.user.id)
    
    const openModal = () => setIsModalOpen(true);
    const closeModal = ()  => {
        setIsModalOpen(false);
    }
    const formatDate = (date) => {
        const day = getDate(date)
        const month = date.toLocaleString('default', { month: 'long' });
        console.log(day , month )
    }
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
    },[reaction])
    
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
    },[])

    const handleComment = async() => {
        console.log('comment' , comment)
        if (!userId) {
            setIsLogin(true)
            openModal()
            return
        }
        try{
            const res = await apiBlogs.post(`create-comment/${id}/`, {
                'user' : userId,
                'name' : comment,
                'post' : id
            })
            console.log(res.data?.message)
            setComment('')
            getComments()
        }catch(e){
            console.error('error while comment posting' , e)
        }
    }

    const timeAgo = (timeStamp) => {
        const now = new Date()
        const past = new Date(timeStamp)
        const diff = Math.floor((now - past) / 1000 )
        
        if (diff < 60) return `${diff} seconds ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        const timeDiff = `${Math.floor(diff / 86400)} days ago`;
        return timeDiff
    }

    if (loading) {
        return (
            <div className='flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-white'>
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-blue-600 font-medium">Loading amazing content...</p>
                </div>
            </div>
        )
    }

    console.log(allComments)

    return(
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
            <Nav/>
        
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8">
                        
                        <div className="lg:col-span-2">
                            <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 hover:shadow-2xl transition-all duration-300">
                                
                                {postDetails?.images?.length > 0 && (
                                    <div className="relative overflow-hidden group">
                                        <img
                                            src={postDetails.images[0].image}
                                            alt={postDetails.title}
                                            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                        <div className="absolute top-4 right-4 flex space-x-2">
                                      
                                            <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                                                <Share2 className="w-5 h-5 text-blue-600" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="p-8">
                                    <header className="mb-6">
                                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                            {postDetails.title}
                                        </h1>
                                        
                                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-black-600 rounded-full flex items-center justify-center">
                                                    <User className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="font-medium">{postDetails.author_name}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-4 h-4 " />
                                                <span>Published recently</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Eye className="w-4 h-4 " />
                                                <span>Reading time: 5 min</span>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {postDetails.tags.map((tag, index) => (
                                                <span 
                                                    key={index} 
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
                                                >
                                                    <Tag className="w-3 h-3 mr-1" />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </header>

                                    {/* Article Content */}
                                    <div className="prose prose-lg max-w-none mb-8">
                                        <p className="text-gray-700 leading-relaxed text-lg">
                                            {postDetails?.content}
                                        </p>
                                    </div>

                                    <div className="border-t border-blue-100 pt-6">
                                        <LikeDislikeButton 
                                            postId={postDetails.id} 
                                            like_count={postDetails.like_count} 
                                            unlike_count={postDetails.unlike_count} 
                                            onChangeReactions={(value) => setReaction(value)}
                                        />
                                    </div>
                                </div>
                            </article>
                        </div>

                        {/* Comments Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-xl border border-blue-100 sticky top-8">
                                
                                {/* Comments Header */}
                                <div className="p-6 border-b border-blue-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-gray-300 rounded-full flex items-center justify-center">
                                                <MessageCircle className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl text-gray-900">Comments</h3>
                                                <p className="text-sm text-gray-500">{allComments.length} conversation{allComments.length !== 1 ? 's' : ''}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="max-h-96 overflow-y-auto">
                                    {allComments.length > 0 ? (
                                        <div className="p-4 space-y-4">
                                            {allComments.map((comment, index) => (
                                                <div key={index} className="group">
                                                    <div className="flex space-x-3 p-4 rounded-xl hover:bg-blue-50 transition-colors duration-200">
                                                        <Stack>
                                                            <Avatar 
                                                                sx={{ 
                                                                    fontSize: '14px', 
                                                                    height: '36px', 
                                                                    width: '36px',
                                                                    background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
                                                                }}
                                                            >
                                                                {comment.username[0].toUpperCase()}
                                                            </Avatar>
                                                        </Stack>
                                                        
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <span className="font-semibold text-gray-900 text-sm">
                                                                    {comment.username}
                                                                </span>
                                                                <div className="flex items-center text-xs text-gray-500">
                                                                    <Clock1 className="w-3 h-3 mr-1" />
                                                                    {timeAgo(comment.created_at)}
                                                                </div>
                                                            </div>
                                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                                {comment.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {index < allComments.length - 1 && (
                                                        <div className="ml-12 border-b border-blue-50"></div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center">
                                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <MessageCircle className="w-8 h-8 text-blue-500" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Start the conversation</h3>
                                            <p className="text-sm text-gray-500 mb-4">
                                                Be the first to share your thoughts on this post!
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Add Comment */}
                                <div className="p-4 border-t border-blue-100">
                                    <div className="flex space-x-3">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Share your thoughts..."
                                                className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                                                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                                            />
                                        </div>
                                        <button 
                                            onClick={handleComment}
                                            className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center group"
                                        >
                                            <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} closeModal={closeModal}>
                <AuthContainer isModalClose={closeModal} Logined={isLogin} />
            </Modal>
        </div>
    )
}  

export default BlogInfo