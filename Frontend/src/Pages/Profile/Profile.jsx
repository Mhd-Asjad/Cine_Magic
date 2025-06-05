import React, { useEffect, useRef, useState } from "react";
import Nav from "../../components/Navbar/Nav";
import Footer from "../../components/Footer/footer";
import { useSelector } from "react-redux";
import probg from '../../assets/profilebg1.jpg'
import { TbLogout2 } from "react-icons/tb";
import { FaAngellist } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { useDispatch } from "react-redux";
import { setUsername , setEmail } from "@/Redux/Features/UserSlice";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, CheckCircle, DeleteIcon,  User , CalendarRange , Trash, X , ShieldAlert } from 'lucide-react';
import LocationPicker from "@/Components/Map/LocationPicker";
import 'leaflet/dist/leaflet.css';
import { Link, useNavigate } from "react-router-dom";
import apiBlogs from "@/Axios/Blogapi";
import {
  AlertDialog , 
  AlertDialogTrigger , 
  AlertDialogContent , 
  AlertDialogHeader , 
  AlertDialogCancel , 
  AlertDialogTitle , 
  AlertDialogDescription , 
  AlertDialogFooter 
} 
from "@/Components/ui/alert-dialog";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { set } from "date-fns";
import userApi from "@/Axios/userApi";
import TheatreApi from "@/Axios/theatreapi";
const Profile = () => {

  toastr.options = {
    closeButton: true,
    debug: false,
    progressBar: true,
    preventDuplicates: true,
    positionClass: "toast-top-right",
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };
  const [showContactForm, setShowContactForm] = useState(false);
  const [ showEditForm , setShowEditForm ] = useState(false);
  const [ showPostForm , setShowPostForm ] = useState(false);
  const [ theatreName , setTheatreName ] = useState('');
  const [ ownerImage , setOwnerImage ] = useState('')
  const [ location , setLocation ] = useState('');
  const [ state , setState ] = useState('');
  const [pincode , setPincode ] = useState('');
  const [latitude , setLatitude ] = useState('')
  const [ longitude , setLongitude ] = useState('') 
  const [ text , setText ] = useState('');
  const [blogs , setBlogs] = useState([]);
  const user = useSelector((state) => state.user)
  const [ errors , setErrorMessage ] = useState({});
  const [newUsername , setNewUsername ] = useState('');
  const [newEmail , setNewEmail ] = useState('');
  const [ isEditing , setIsEditing] = useState(false);
  const [ editBlog , setEditBlog] = useState(null);
  const [ imageError , setImageError] = useState('');
  const [ showAnimation , setShowAnimation] = useState(false)
  const [animationType, setAnimationType] = useState('');
  const [ confirmDelete , setConfirmDelete] = useState(false);
  const [ fieldError , setFieldError] = useState('');
  const {toast} = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(user)
  const handleToggleForm = () => {
    setShowContactForm(!showContactForm);
  };
  const handleToggleForm1 = () => {
    setShowEditForm(!showEditForm)
    setNewUsername(user.username)
    setNewEmail(user.email)
  }

  const handlePostForm = () => {
    setShowPostForm(!showPostForm)
  } 
  
  const validateFields = () => {
    const newErrors = {};

    if (!theatreName || theatreName.length < 4) {
      newErrors.theatreName = '* theatre name more than 4 character!'
    }

    if (!state) {
      newErrors.state = '* state is required';
    }
    if (!location) {
      newErrors.location = '* location is required';
    }
    if ( !pincode || pincode.length !== 6 ){
      newErrors.pincode = '* Enter a valid 6-digit Pincode.';
    }
    setErrorMessage(newErrors)
    return Object.keys(newErrors).length === 0 ;

  }

  const handleSuccess = (message ) => {
    toastr.success(message)
    setTheatreName('')
    setLocation('')
    setState('')
    setPincode('')
    setText('')
    setShowContactForm(false)

  }
  const handleSubmit = async (event) => {
    event.preventDefault(); 

    if (!validateFields()) return

    try {
      const response = await TheatreApi.post('/create_profile/', {
        'user' : user.id ,
        'owner_photo' : ownerImage,
        'theatre_name' : theatreName ,
        'latitude' : latitude,
        'longitude' : longitude,
        'location' : location ,
        'state' : state , 
        'pincode' : pincode,
        'user_message' : text
      },
     {
      headers: { 'Content-Type': 'multipart/form-data'        
      },
    });

      handleSuccess(response.data.message)  

    }catch(e) {

      const error = e.response?.data?.user || e.response.data.error;
      console.log(error);
      toastr.warning(error);
    }
  };
  useEffect(() => {
    fetchBlogs()
    setTimeout(() => setShowAnimation(false), 3000);

  },[showAnimation])
  const fetchBlogs = async() => {

    try {
        const res = await apiBlogs.get(`get-posts/${user.id}/`)
        setBlogs(res.data)
    }catch(error){
      console.log(error?.response)        
    }

  }

  const handleEditBlog = (blog_id) => {
    const div = document.getElementById("edit-post")
    if (div){
      div.scrollIntoView({ behavior : 'smooth' })
    }
    const blogToEdit = blogs.filter(blog => blog.id === blog_id)
    setEditBlog(...blogToEdit);
    setIsEditing(true)
  }

  const handleDeleteBlog = async(blog_id) => {
    try {
      const res = await apiBlogs.delete(`delete-post/${blog_id}/`)
      if (res.status === 204) {
        setBlogs(blogs.filter(blog => blog.id !== blog_id))
        triggerAnimation('delete')
      }
    }catch(e) {
      console.log('error while deleting blog' , e)
    }
  }

  const triggerAnimation = (type) => {
    setAnimationType(type)
    setShowAnimation(true)
    setTimeout(() => setShowAnimation(false), 3000);

  }
              
  const handleImageChange = (e) => {
    const file = e.currentTarget.files[0] || null;
    if (file) {
      setImageError('');
      const filePath = URL.createObjectURL(file);
      setEditBlog((prev) => ({
        ...prev,
        images: [{ file: file , preview : filePath }],
      }));

    } else {
      setImageError('Please add a media file.');
    };
  };

  const handleRemoveTag = (removedTag) => {
    const filteredTags = editBlog.tags.filter((tag) => tag !== removedTag)
    const tagCount = editBlog.tags[0].length
  
    if (tagCount === 0) {
      alert('atleast one tag is required')
    }
    setEditBlog(prev => ({
      ...prev , 
      tags : filteredTags
    }))
  }
   

  const handleUserEdit = async(e) => {
    e.preventDefault()
    try {
      const res = await userApi.put(`edit-user/${user.id}/`,{
        'username' : newUsername,
        'email' : newEmail
      })
      const {username , email } = res.data
      dispatch(setUsername(username))
      dispatch(setEmail(email))
      toast({
        title : 'user updated successfully'
      })
      handleToggleForm1()
  
      }catch(e){
      console.log(e)

    }
  }


  const handleCrud = ( ) => {
    setIsEditing(false);
  }
  const handleEditTask = async(e , blog_id) => {
    e.preventDefault()
    console.log(!editBlog.title , 'edit blog')
    if (!editBlog.title || !editBlog.content || !editBlog.images[0]?.file) {
      setFieldError('Please fill all the fields');
      setShowAnimation(true);
      setAnimationType('editError')
    }
    console.log(blog_id , 'blog id')
    const formData = new FormData();
    formData.append('title' ,editBlog.title)
    formData.append('content' , editBlog.content)
    console.log(editBlog.images[0].file , 'image file')
    if (editBlog.images[0].file) {
      formData.append('images' , editBlog?.images[0]?.file)
    }
    formData.append('tags', JSON.stringify(editBlog.tags));
    formData.append('author' , editBlog.author_name)
    formData.append('user' , user.id)
    console.log(formData , 'form data')
    try {

      const res = await apiBlogs.put(`edit-post/${blog_id}/`,formData, {
        headers : { 'Content-Type': 'multipart/form-data' }
      })

      if (res.status === 200){
        triggerAnimation('edit')
        handleCrud()
        fetchBlogs()
        setEditBlog(null)

      }
    }catch(e) {
      console.log('error while updating blog ' , e)
    };

  };

  console.log(user , 'user in profile')
  const handleLocationSelect = async(location) => {
    setLatitude(location[0] )
    setLongitude(location[1])
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const data = await res.json();
        console.log(data)
        setLocation( data.address.city || data.address.town || data.address.village || '');
        setState(data.address.state)
        setPincode(data.address.postcode)
    }catch(e) {
      console.log('reserve geo coding failed' , e);
    }
  };

  const formatTime = (dateTime) => {
    const dateString = dateTime.split('T')[0]
    const timeString = dateTime.split('T')[1]
    const [hours , minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours , minutes)
    const formattedTime = date.toLocaleTimeString([] , {hour : '2-digit' , minute : '2-digit' , hour12:true});
    return dateString + ' ' + formattedTime

  }

  const handleImageDelete = (e) => {
    e.preventDefault()
    setEditBlog((prev) => ({
      ...prev,
      images: [],
    }));
    setImageError('please add a media file')
  }
  console.log(editBlog , 'edit blog preview')
  return (  
    <div>

      <Nav/>
    <div className="bg-white shadow-md flex flex-col items-center">
      <img className="reletive w-full h-20"  src={probg} alt="" />
      <div className="absolute mt-8 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-4xl text-white">
        <span>👤</span>
      </div>
      <div className="text-center mt-4 p-2" >

      <h1 className="text-xl font-semibold text-gray-800">{user.username}</h1>
      <p className="text-gray-500 text-sm">{user.email}</p>
      </div>
    </div>

      <div className="max-w-3xl mx-auto mt-[5%] bg-blend-soft-light space-y-4">

        <div
          onClick={handleToggleForm}
          className="flex gap-1 py-3 px-4 bg-gray-50 rounded shadow-sm hover:bg-gray-100 cursor-pointer"
        >
          <FaPhone className="text-2xl text-gray-400" /> Contact Us
        </div>

        {showContactForm && (
          <div className="mt-4   p-4 rounded shadow-sm">
            <h3 className="font-semibold text-center " >Theatre registration </h3>
            <form onSubmit={handleSubmit} encType="multipart/form-data    " >

            <div className="grid grid-flow-rows grid-cols-2 gap-1" >
              <div classname="" >


              <label className="block text-sm font-medium text-gray-700">
                Theatre Name
              </label>
              <input
                type="text"
                className="mt-1 block w-[80%] p-2 border rounded"
                placeholder="Enter your name"
                onChange={(e) => setTheatreName(e.target.value)}
              />
              {errors.theatreName && (
                <p className="text-red-500 text-sm font-semibold">{errors.theatreName}</p>
              )}
              </div>
              <div>
              <label className="block text-sm font-medium  text-gray-700">your image</label>
              <input
                type="file" 
                className="mt-1 block w-[80%] p-2 border rounded bg-white"
                accept="image/"
                placeholder="your image"
                onChange={(event) => setOwnerImage(event.currentTarget.files[0] || null)}
              />
              </div>
            </div>

            <div className="mt-3" >
              <span className="font-semibold flex justify-center pb-2" >Select location here </span>
              <LocationPicker onLocationSelect={handleLocationSelect} />
            </div>
              <label className="block mt-4 text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                value={location}
                className="mt-1 block w-full p-2 border rounded"
                placeholder="Enter your Location "
                onChange={(e) => setLocation(e.target.value)}
              />
              {errors.location && (
                <p className="text-red-500 text-sm font-semibold" >{errors.location}</p>
              )}
              <label className="block mt-4 text-sm font-medium text-gray-700">
                state
              </label>
              <input 
                type="text"
                value={state}
                className="mt-1 block w-full p-2 border rounded"
                placeholder="enter your state"
                onChange={(e) => setState(e.target.value)}
              />
              {errors.state && (
                <p className="text-red-500 text-sm font-semibold" >{errors.state}</p>
              )}
              <label className="block mt-4 text-sm font-medium text-gray-700">
                Pin
              </label>
              <input 
                type="number"
                value={pincode}
                className="mt-1 block w-full p-2 border rounded"
                placeholder="enter your pincode"
                onChange={(e) => setPincode(e.target.value)}
              />

              {errors.pincode && (
                <p className="text-red-500 text-sm font-semibold" >{errors.pincode}</p>
              )}

              <label className="block mt-4 text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                className="mt-1 block w-full p-2 border rounded"
                rows="3"
                placeholder="Write your message"
                onChange={(e) => setText(e.target.value)}
              ></textarea>
              <button
                type="submit"
                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </form>
          </div>
        )}
        <div 
          className="flex gap-1 py-3 px-4 bg-gray-50 rounded shadow-sm hover:bg-gray-100 cursor-pointer"
          onClick={handlePostForm}
        >
          <FaAngellist className="text-2xl text-gray-500" /> Blogs
        </div>
          { showPostForm && 
            <div className="mt-4 shodow-md rounded-md bg-gray-50 mb-8" >
                <div className="max-w-6xl max-auto" >
                  <div className="flex justify-between ml-2 items-center mb-5">
                    <h1 className="text-2xl font-bold text-gray-800">My Blog🎬</h1>


                        <button
                          onClick={() => navigate('/blogs/add')}
                          className="flex items-center gap-2 outline outline-1 outline-gray-100 mr-2 mt-3 bg-gray-300 px-2 py-1 rounded-lg transition-all duration-300 transform hover:scale-105"

                        >
                          <Plus size={23} />
                          <span>Create</span>
                        </button>
                      </div>

                        {showAnimation && (
                          <div className="fixed top-[20%] right-4 z-50 flex  items-center gap-2 px-4 py-3 rounded-lg bg-white shadow-lg transform animate-bounce">
                           
                            {animationType === 'edit' && (
                              <>
                                <CheckCircle className="text-blue-500" size={24} />
                                <span className="font-medium">Post updated successfully!</span>
                              </>
                            )}
                            {animationType === 'delete' && (
                              <>
                                <CheckCircle className="text-red-500" size={24} />
                                <span className="font-medium">Post deleted successfully!</span>
                              </>
                            )}

                            {animationType === 'editError' && (
                              <>
                                <ShieldAlert className="text-red-500" size={24} />
                                <span className="font-medium">{fieldError}</span>
                              </>

                            )}
                          </div>
                        )}


                      {isEditing && (

                        <div id="edit-post" className="bg-white mx-auto rounded-lg p-6 mb-8 border border-gray-200" >

                          <div className="flex justify-between items-center" >
                              <h2 
                                className="text-lg text-gray-800 font-semibold"
                              >

                              </h2>
                              <button
                                onClick={() => handleCrud()}
                                className="text-gray-500 hover:text-gray-700"

                              >
                                <X size={20} />

                              </button>
                          </div>

                          <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                              type="text"
                              value={editBlog.title}
                              onChange={(e) => setEditBlog({...editBlog , title : e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter blog title"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <textarea
                              value={editBlog.content}
                              onChange={(e) => setEditBlog({...editBlog , content : e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                              placeholder="Enter blog content"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">image</label>
                            <input
                              type="file"
                              accept=""
                              onChange={handleImageChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter author name"
                              />
                              </div>

                              {imageError && (
                                <div className="flex items-center mt-1 text-red-500 text-xs">
                                  <span className="mr-1">⚠</span> {imageError}
                                </div>
                              )}
                              {editBlog?.images[0]?.preview &&

                              <div className="relative w-full h-full">
                                <img
                                  src={editBlog?.images[0]?.preview || editBlog?.images[0]?.image}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                  className="absolute top-4 right-4 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:text-black-600"
                                  onClick={handleImageDelete}
                                  type="button"
                                >
                                  <DeleteIcon className="text-red-500" size={23} />
                                </button>
                              </div>

                            }
                              

                          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                          <div className="flex gap-2 flex-wrap mb-2">
                            {editBlog.tags.length > 0 ? (
                            editBlog.tags.map((tag, index) => (
                              <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                                <span className="text-sm text-gray-700">{tag}</span>
                                <button 
                                  onClick={() => handleRemoveTag(tag)}
                                  className="ml-2 text-gray-500 hover:text-gray-700"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))):(
                              <div className="flex justify-center" >

                                <p>no tag found</p>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-center mb-4" >

                            <button 
                              className="bg-gray-200 text-gray-700 px-3 py-1 font-semibold rounded-md hover:bg-gray-300"
                              onClick={(e)=> handleEditTask( e ,editBlog.id)}
                            >
                              edit Post
                            </button>
                          </div>

                          </div>
                        
                        </div>

                      )}  
                    <div className="p-5 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
                    {!blogs?.message ? (
                      
                      blogs.map((blog) => (
                        <div key={blog.id} className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg hover:translate-y-px border border-gray-200">
                          <img
                            src={blog.images[0]?.image || blog.images[0]?.image}
                            alt={blog.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                              <h3 className="text-xl font-semibold text-gray-800 mb-2">{blog.title}</h3>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditBlog(blog.id)}
                                  className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                                >
                                  <Edit size={18} />
                                </button>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <button 
                                      onClick={() => setConfirmDelete(true)}
                                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                                      >
                                      <Trash size={18} />
                                    </button>
                                  </AlertDialogTrigger>
                                 
                                {confirmDelete &&
                                  <AlertDialogContent className="w-[400px]">

                                    <AlertDialogHeader>

                                      <AlertDialogTitle className="text-center text-lg font-semibold">Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription className="text-center text-gray-500">
                                        This action cannot be undone. This will permanently delete your post.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="flex justify-center gap-4 mt-4">
                                      <AlertDialogCancel className="bg-gray-200 text-gray-700 hover:bg-gray-300">
                                        Cancel
                                        
                                      </AlertDialogCancel>
                                      <AlertDialogAction className="bg-red-500 py-2 px-2 rounded text-white hover:bg-red-600" onClick={() => handleDeleteBlog(blog.id)}>
                                        Confirm
                                        <Trash size={18} className="mb-1 gap-1 inline" />
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                }
                                </AlertDialog>

                              </div> 
                            </div>
                            <p className="text-gray-600 mb-4 line-clamp-3">{blog.content}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {blog.tags.map((tag, index) => (
                                <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                              <span className="mt-3" > <User size={18} className="inline mb-2" /> {blog.author_name}</span>
                              <span> <CalendarRange size={20} className="inline mb-2" /> {formatTime(blog.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ):(
                       <div className="flex mx-auto h-64">
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
                          <h2 className="text-lg font-semibold text-center">No Posts Found</h2>
                          <p className="text-sm text-gray-400 mt-2 text-center max-w-xs">
                            Looks like there are no posts available right now. Create a new one!
                          </p>
                        </div>
                      </div>
                    )}
                    </div>
                </div>
            </div>
          }

        <div className="flex gap-1 py-3 px-4 bg-gray-50 rounded shadow-sm hover:bg-gray-100 cursor-pointer"
          onClick={handleToggleForm1}
        >
          <FaUserEdit className="text-2xl text-gray-500" /> Edit Profile
        </div>
          { showEditForm &&
          <div className="mt-7 py-7 shadow-md p-4 rounded">
            <form onSubmit={handleUserEdit} >

            <label className="block text-sm font-medium text-gray-700">username</label>
              <div className="mt-2">
                <input type="text" 
                className="mt-1 block w-full p-2 border rounded"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value) }
                />
              </div>
            <label className="block text-sm font-medium text-gray-700">email</label>
              <div className="mt-2">

                <input type="text" 
                className="mt-1 block w-full p-2 border rounded"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value) }
                />
              </div>

              <div className="flex gap-3 justify-end" >
                <button 
                  type="submit"
                  className="mt-4 bg-black py-2 px-1 rounded text-white"
                
                >
                  Submit
                </button>
                <button 
                  className="mt-4 bg-white py-2 px-1 rounded text-black"
                  onClick={handleToggleForm1}
                >
                  cancel
                </button>

              </div>

            </form>
          </div>

          }
        <div className="flex gap-1 py-3 px-4 bg-gray-50 rounded shadow-sm hover:bg-gray-100 cursor-pointer">
         <TbLogout2 className="text-2xl text-gray-500" /> Logout 
        </div>
      </div>

        <div className="mt-[14%]" >
        <Footer/>
        </div>
    </div>
  );
};

export default Profile;
