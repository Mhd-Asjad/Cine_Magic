import React ,{useState , useEffect} from 'react'
import blog_bg from '../../assets/blogbg.jpg'
import { Clock, User, ArrowRight, BookOpen, Calendar, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import apiBlogs from '@/axios/Blogapi'
import Nav from '@/components/navbar/Nav'
import { useNavigate, useLocation } from 'react-router-dom';
import TextPressure from '../reactbits/TextPressure';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

function BlogPosts() {
  const [blogs , setBlogs] = useState([])
  const [loading , setLoading] = useState(false)
  const [ prev , setPrev] = useState(null)
  const [ next , setNext ] = useState(null)
  const [ page , setPage ] = useState(1);
  const [totalPages , setTotalPages] = useState(1)

  const navigate = useNavigate();
  const location = useLocation();

  // Get page from URL params on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const pageFromUrl = parseInt(urlParams.get('page')) || 1;
    setPage(pageFromUrl);
  }, [location.search]);

  const fetchBlogs = async (currentPage = page) => {
    setLoading(true)
    console.log('fetching data from page :' , currentPage)
    try {
      const response = await apiBlogs.get(`get-post/?page=${currentPage}`)
      const data = response.data;
      console.log(data)
      setBlogs(data.results)
      setPrev(data.previous)
      setNext(data.next)
      if (data.count) {
        const page_size = 4;
        setTotalPages(Math.ceil(data.count / page_size))
      }
      
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

  console.log('total pages :',totalPages)
  
  const formatTime = (dateTime) => {
    const dateString = dateTime.split('T')[0]
    const timeString = dateTime.split('T')[1]
    const [hours , minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours , minutes)
    const formattedTime = date.toLocaleTimeString([] , {hour : '2-digit' , minute : '2-digit' , hour12:true});
    return dateString + ' ' + formattedTime
  }

  // Update URL when page changes
  const handlePageChange = (newPage) => {
    setPage(newPage);
    const newUrl = `${location.pathname}?page=${newPage}`;
    window.history.pushState({}, '', newUrl);
  }

  useEffect(() => {
    fetchBlogs(page)
  }, [page])

  console.log(blogs)

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white'>
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-slate-300 rounded-full animate-spin animate-reverse"></div>
          </div>
          <div className="text-center">
            <p className="text-slate-700 font-medium text-lg">Loading amazing stories...</p>
            <p className="text-slate-500 text-sm mt-1">Preparing the best content for you</p>
          </div>
        </div>
      </div>
    )
  }

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const handleBlogClick = (blogId) => {
    navigate(`/posts/details/${blogId}?fromPage=${page}`);
  }

  const handlePrevious = () => {
    if (prev && page > 1) {
      handlePageChange(page - 1);
    }
  }

  const handleNext = () => {
    if (next && page < totalPages) {
      handlePageChange(page + 1);
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white relative overflow-hidden'>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px), 
                           radial-gradient(circle at 75% 75%, #1e293b 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0, 30px 30px'
        }}></div>
      </div>

      <Nav/>
      
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block">
            <TextPressure 
              text="blogs"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#1e293b"
              strokeColor="#3b82f6"
              className='relative z-10'
              minFontSize={88}
            />
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-slate-500/20 blur-xl -z-10 rounded-full"></div>
          </div>
          <p className="text-slate-600 text-lg mt-4 max-w-2xl mx-auto">
            Discover amazing stories, insights, and knowledge from our community of writers
          </p>
        </div>

        {/* Blog Grid */}
        <div className="space-y-8 mb-12">
          {blogs.map((blog, index) => (
            <article 
              key={blog.id} 
              className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden 
                        shadow-lg hover:shadow-2xl 
                        border border-slate-200/50 hover:border-blue-200/50
                        transition-all duration-500 cursor-pointer
                        hover:-translate-y-2 hover:bg-white/95
                        relative"
              onClick={() => handleBlogClick(blog.id)}
              style={{
                boxShadow: `0 10px 25px -5px rgba(15, 23, 42, 0.1), 
                           0 10px 10px -5px rgba(59, 130, 246, 0.05),
                           0 0 0 1px rgba(15, 23, 42, 0.05)`
              }}
            >
              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-slate-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative p-8">
                {/* Blog Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-3 
                                  group-hover:text-blue-900 transition-colors duration-300
                                  leading-tight">
                      {blog.title}
                    </h2>
                    <p className="text-slate-600 text-lg leading-relaxed mb-4">
                      {truncateText(blog.content, 120)}
                    </p>
                  </div>
                  
                  {/* Arrow Icon */}
                  <div className="ml-6 p-3 bg-slate-100 group-hover:bg-blue-100 
                                rounded-full transition-all duration-300
                                group-hover:translate-x-1">
                    <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-blue-600" />
                  </div>
                </div>

                {/* Blog Meta */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  {/* Author */}
                  <div className="flex items-center space-x-2 text-slate-700">
                    <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-700 
                                  rounded-full flex items-center justify-center">
                      <User className="ml-1 text-white" />
                    </div>
                    <span className="font-medium">{blog.author_name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>{formatTime(blog.created_at)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{blog.read_time || '5 min read'}</span>
                  </div>

                  {/* Reading Badge */}
                  <div className="ml-auto">
                    <span className="inline-flex items-center px-3 py-1 rounded-full 
                                   bg-blue-100 text-blue-700 text-xs font-medium
                                   group-hover:bg-blue-200 transition-colors">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Read More
                    </span>
                  </div>
                </div>

                {/* Bottom Gradient Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 
                              bg-gradient-to-r from-blue-500/20 via-slate-500/20 to-blue-500/20 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </article>
          ))}
        </div>

        {/* Enhanced Pagination */}
        <div className="flex mx-auto justify-center">
          
            <Pagination className='flex justify-center items-center'>
              <PaginationContent className="flex items-center space-x-2">
                
                {/* Previous Button */}
                <PaginationItem>
                  <button
                    onClick={handlePrevious}
                    disabled={!prev}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      prev 
                        ? 'text-slate-700 hover:text-blue-600 hover:bg-blue-50 cursor-pointer' 
                        : 'text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                </PaginationItem>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = page === pageNum;
                    
                    return (
                      <PaginationItem key={i}>
                        <button
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                              : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      </PaginationItem>
                    );
                  })}
                </div>

                <PaginationItem>
                  <button
                    onClick={handleNext}
                    disabled={!next}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      next 
                        ? 'text-slate-700 hover:text-blue-600 hover:bg-blue-50 cursor-pointer' 
                        : 'text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </PaginationItem>

              </PaginationContent>
            </Pagination>

            <div className="text-center mt-4 text-sm text-slate-600">
              Page {page} of {totalPages} • {blogs.length} articles
            </div>
          </div>
        </div>
      </div>
  );
}

export default BlogPosts