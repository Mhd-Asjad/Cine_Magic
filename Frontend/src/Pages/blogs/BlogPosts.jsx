import React ,{useState , useEffect} from 'react'
import blog_bg from '../../assets/blogbg.jpg'
import { Clock, User } from 'lucide-react';
import apiBlogs from '@/Axios/Blogapi'
import Nav from '@/Components/Navbar/Nav'
import { useNavigate } from 'react-router-dom';
function BlogPosts() {
  const [blogs , setBlogs] = useState([])
  const [loading , setLoading] = useState(false)
  const navigate = useNavigate();
  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const response = await apiBlogs.get('get-post/')
      setBlogs(response.data)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setLoading(false)
    }
  }

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
    fetchBlogs()
  }, [])

  console.log(blogs)

  if (loading) {
    return <div className='flex justify-center items-center h-screen'>Loading...</div>
  }

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (

    <div>
      <Nav/>
      <div className="max-w-6xl mx-auto  px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Cine Talks </h2>
        
        <div className="grid grid-rows-2 md:grid-cols-2 mt-[7%] gap-8">
          {blogs.map((blog, index) => (
            <div key={blog.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={blog.images[0]?.image || blog_bg} 
                  alt={blog.title} 
                  onClick={() => navigate(`/posts/details/${blog.id}`)}
                  className="w-full min-h-52 h-60 object-cover"
                />
                {blog.tags.map((tag) => (
                  
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-300 text-white px-3 py-1 text-xs font-semibold rounded">
                    {tag}
                  </span>
                </div>
                ))}
              </div>
              
              <div className="p-6">
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
        </div>
      </div>
    </div>
    );
  }
export default BlogPosts
