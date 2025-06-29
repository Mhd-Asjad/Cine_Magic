import apiBlogs from '@/axios/Blogapi';
import React, { useEffect , useState } from 'react'
import { useParams } from 'react-router-dom';
import Nav from '@/components/navbar/Nav';
import { User , Tag , Calendar , Eye  } from 'lucide-react';
import { useSelector } from 'react-redux';
import LikeDislikeButton from './LikeDislikeButton';
import Modal from '@/components/modals/Modal';
import AuthContainer from '../userauth/AuthContainer';
import { getDate, getDay } from 'date-fns';
import { MessageCircle, Clock1, Send, Share2 , MoreHorizontal, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, Stack } from "@mui/material"

function BlogInfo() {
    const [postDetails , setPostDetails] = useState(null);
    const [comment , setComment] = useState('');
    const [ allComments , setAllComments ] = useState([])
    const [ loading , setLoading] = useState(true)
    const [reaction , setReaction] = useState(null)
    const [isModalOpen , setIsModalOpen] = useState(false);
    const [isLogin , setIsLogin] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingText, setEditingText] = useState("");
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

    function formatISODate(isoString) {
        const date = new Date(isoString);

        const options = {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };

        return date.toLocaleString('en-IN', options);
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
    const handleEditComment = (commentId , currentText) => {
    
    console.log('Edit comment:', commentId);
    setEditingCommentId(commentId)
    setEditingText(currentText)
    };

    const handleDeleteComment = async (commentId) => {
        
        try {
            const res = await apiBlogs.delete(`comment-edit/${commentId}/`)
            console.log(res.data , 'response from bakcend edit save')
        }catch(e) {
            console.log(e , 'error from the edit saving')
        }finally{
            getComments()
        }
        setEditingCommentId(null);
        setEditingText("");
    };


    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditingText("");
    };

    const saveCommentEdit = async(comment_id) => {

        if (editingText.trim() === "") {
        return; 
        }

        try {
            const res = await apiBlogs.put(`comment-edit/${comment_id}/`,{'name' : editingText })
            console.log(res.data , 'response from bakcend edit save')
        }catch(e) {
            console.log(e , 'error from the edit saving')
        }finally{
            getComments()
        }
        setEditingCommentId(null);
        setEditingText("");

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

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-xl border border-blue-100 sticky top-8">
                                
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
                                                            <div className="flex items-center justify-between mb-1">
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="font-semibold text-gray-900 text-sm">
                                                                        {comment.username}
                                                                    </span>
                                                                    <div className="flex items-center text-xs text-gray-500">
                                                                        <Clock1 className="w-3 h-3 mr-1" />
                                                                        {timeAgo(comment.created_at)}
                                                                    </div>
                                                                </div>
                                                            {
                                                                comment.user === userId &&
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button 
                                                                            variant="ghost" 
                                                                            size="sm" 
                                                                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-100"
                                                                            >
                                                                            <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end" className="w-[160px]">
                                                                        <DropdownMenuLabel className="text-xs font-medium text-gray-500">
                                                                            Actions
                                                                        </DropdownMenuLabel>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuGroup>
                                                                            <DropdownMenuItem 
                                                                                className="cursor-pointer focus:bg-blue-50"
                                                                                onClick={() => handleEditComment(comment.id , comment.name)}
                                                                                >
                                                                                <Edit className="mr-2 h-4 w-4 text-blue-500" />
                                                                                <span className="text-sm">Edit</span>
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem 
                                                                                className="cursor-pointer focus:bg-red-50 text-red-600"
                                                                                onClick={() => handleDeleteComment(comment.id)}
                                                                            >
                                                                                <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                                                                <span className="text-sm">Delete</span>
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuGroup>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            }
                                                            </div>
                                                            
                                                            {editingCommentId === comment.id ? (
                                                                <div className="mt-2">
                                                                <textarea
                                                                    value={editingText}
                                                                    onChange={(e) => setEditingText(e.target.value)}
                                                                    className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent resize-none text-sm"
                                                                    rows={3}
                                                                    autoFocus
                                                                    onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' && e.ctrlKey) {
                                                                        saveCommentEdit(comment.id);
                                                                    } else if (e.key === 'Escape') {
                                                                        handleCancelEdit();
                                                                    }
                                                                    }}
                                                                />
                                                                <div className="mt-2 text-xs text-gray-500">
                                                                    Press Ctrl+Enter to save, Escape to cancel
                                                                </div>
                                                                </div>
                                                            ) : (
                                                                <p className="text-md text-gray-700 leading-relaxed">
                                                                {comment.name}
                                                                </p>
                                                            )}                                             
                                                           <div className="flex items-center text-xs text-gray-500">
                                                               { editingCommentId == comment.id ? '' : `at ${formatISODate(comment.created_at)}`}
                                                            </div>
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

                                <div className="p-4 border-t border-blue-100">
                                    <div className="flex space-x-3">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Share your thoughts..."
                                                className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200 text-sm"
                                                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                                            />
                                        </div>
                                        <button 
                                            onClick={handleComment}
                                            className="px-4 py-3 bg-gradient-to-r from-gray-500 to-black text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center group"
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