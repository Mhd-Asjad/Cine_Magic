import React ,{useState , useEffect} from 'react'
import blog_bg from '../../assets/blogbg.jpg'
import { Clock, User } from 'lucide-react';
import apiBlogs from '@/Axios/Blogapi'
import Nav from '@/Components/Navbar/Nav'
import { useNavigate } from 'react-router-dom';


import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Pages } from '@mui/icons-material';

function BlogPosts() {
  const [blogs , setBlogs] = useState([])
  const [loading , setLoading] = useState(false)
  const [ prev , setPrev] = useState(null)
  const [ next , setNext ] = useState(null)
  const [ page , setPage ] = useState(1);
  const [totalPages , setTotalPages] = useState(1)

  const navigate = useNavigate();
  const fetchBlogs = async () => {
    setLoading(true)
    console.log('fetching data from page :' , page)
    try {
      const response = await apiBlogs.get(`get-post/?page=${page}`)
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

  useEffect(() => {
    fetchBlogs(page)
  }, [page])

  console.log(blogs)

  if (loading) {
    return <div className='flex justify-center items-center h-screen'>Loading...</div>
  }

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };
  console.log(next)

  return (

    <div className='bg-gray-50 min-h-screen' >
      <Nav/>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Cine Talks </h2>
        
        <div className="grid grid-rows-2 md:grid-cols-1 mt-[4%] gap-8"

>

          {blogs.map((blog, index) => (
            <div 
              key={blog.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg hover:bg-gray-50 transition-shadow duration-300"
              onClick={() => navigate(`/posts/details/${blog.id}?fromPage=${page}`)}

            >
            
              <div
                className="p-6 cursor-pointer"
              >
                <h3 className="text-xl font-bold mb-3 text-gray-800">{blog.title}</h3>
                <p className="text-gray-600 mb-4">{truncateText(blog.content, 50)}</p>
                
                <div className="flex items-center justify-between text-gray-500 text-sm">
                  <div className="flex items-center">
                    <User size={16} className="mr-1" />
                    <span>{blog.author_name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      <span>{formatTime(blog.created_at)}</span>
                    </div>
                    <span className="text-gray-400">{blog.read_time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
            <div  >
            <Pagination className='flex justify-center items-center' >

              <PaginationContent>
                <PaginationItem >
                  <PaginationPrevious
                    className={ prev ? 'cursor-pointer' : 'cursor-not-allowed'}
                    onClick={() => setPage(prev => Math.max( prev - 1 , 1 ))}
                    disable={prev === null}
                  />

                </PaginationItem>
              
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i} className="cursor-pointer" >
                    <PaginationLink isActive={page === i + 1} onClick={() => setPage(i + 1)}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                // not working expectedd
                ))}

             
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>

                  <PaginationNext 
                    className={ next ? `cursor-pointer`:'cursor-not-allowed'}
                    onClick={() => setPage(prev => prev + 1 )}
                    disable={next === null}
                  // not done when page back to it loads from first page   
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

           </div>
        </div>
      </div>
    </div>
    );
  }
export default BlogPosts
