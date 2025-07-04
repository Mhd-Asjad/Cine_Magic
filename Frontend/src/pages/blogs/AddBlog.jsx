import React, { useState, useEffect } from 'react';
import { X, CloudDownload, Tags, DeleteIcon, CheckCircle } from 'lucide-react';
import Nav from '@/components/navbar/Nav';
// import ShinyText from '../ReactBits/ShinyButton';
import apiBlogs from '@/axios/Blogapi';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useToast } from '@/hooks/use-toast';

function AddBlog() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState(''); 
  const [newTags, setNewTags] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [titleError, setTitleError] = useState('');
  const [imageError, setImageError] = useState('');
  const [tagError , setTagError] = useState('');
  const [ showAnimation , setShowAnimation] = useState(false)
  const [animationType, setAnimationType] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const maxTitleLength = 200;
  const userId = useSelector((state) => state.user.id);
  const { toast } = useToast();
  const navigate = useNavigate();
  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    if (value.trim() === '') {
      setTitleError('Please fill out this field.');
    } else {
      setTitleError('');
    }
  };

  const handleAddTag = () => {
    if (!tags){
      setTagError('please fill out this field')
      return
    }
    if (tags.length > 20) {
      setTagError('Tag should be less than 20 characters');
      return;
    }
    if (newTags.includes(tags.trim())) {
      setTagError('Tag already exists');
      return;
    }
    if (!tags.trim()) return;
    setNewTags((prevItems) => [...prevItems, tags.trim()]);
    setTags(''); 
    if (tagError) {
      setTagError('')
    }
    
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
  }

  const closeModal = () => {
    setSelectedImage(null);
  };
  const handleImageDelete = () => {
    setImage(null);
    setImagePreview(null);
    setImageError('Please add a media file');
  };

  const handleRemoveTag = (removedTag) => {
    setNewTags((prevTags) => prevTags.filter((tag) => tag !== removedTag));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0] || null;
    setImage(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setImageError('');
    } else {
      setImagePreview(null);
      setImageError('Please add a media file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0] || null;
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setImageError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setTitleError('Please fill out this field.');
      toast({
        title: 'Title is required',
        variant: 'destructive',
      });
      return;
    }
    if (!description.trim()) {
      toast({
        title: 'Description is required',
        variant: 'destructive',
      });
      return;
    }
   const triggerAnimation = (type) => {
      setAnimationType(type)
      setShowAnimation(true)
      setTimeout(() => setShowAnimation(false), 3000);

      }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', JSON.stringify(newTags)); 
    if (image) {
      formData.append('image', image);
    }

    try {
      const res = await apiBlogs.post(`create-post/${userId}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.status === 201) {
        triggerAnimation('add')
        setTitle('');
        setDescription('');
        setNewTags([]);
        setImage(null);
        setImagePreview(null);
        setTimeout(() => {

          navigate('/profile')

        },3000)
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: error?.response?.data?.error || 'Failed to create post',
        variant: 'destructive',
      });
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000
    },
    largeImage: {
      maxWidth: '90%', maxHeight: '90%', borderRadius: '10px'
    }
  };

  return (
    <div>
      <Nav />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-transparent max-w-lg w-full mx-auto rounded-xl p-6">
            {showAnimation && (
              <div className="fixed top-[13%] right-7 z-50 flex items-center gap-2 px-4 py-3 rounded-lg bg-white shadow-lg transform animate-bounce">
                {animationType === 'add' && (
                  <>
                    <CheckCircle className="text-green-500" size={24} />
                    <span className="font-medium">Post added successfully!</span>
                  </>
                )}
              </div>
            )}
          <div className="mb-5 text-center">
            <h2>Add Post</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="relative mb-4">
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  className={`w-full px-4 py-2 border-2 rounded-lg text-sm focus:outline-none ${
                    titleError ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Title*"
                />
                <span className="absolute right-3 top-1/3 transform -translate-y-1/2 text-gray-500 text-sm">
                  {title.length}/{maxTitleLength}
                </span>
                {titleError && (
                  <div className="flex items-center mt-1 text-red-500 text-xs">
                    <span className="mr-1">⚠</span> {titleError}
                  </div>
                )}
              </div>

              <div className="flex gap-2 ml-2 flex-wrap mb-2">
                {newTags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-100 px-3 py-1 rounded-full"
                  >
                    <span className="text-sm text-gray-700 font-semibold">
                      <Tags className="inline" size={15} /> {tag}
                    </span>
                    
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      type="button"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex mt-4 gap-4">
                <input
                  type="text"
                  className="size-[74%] px-4 py-2 border-2 rounded-lg text-sm focus:outline-none"
                  placeholder="Add Tags*"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                <button
                  className="mb-4 px-4 mt-1 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
                  onClick={handleAddTag}
                  type="button"
                >
                  Add tags
                </button>
              </div>
                  {tagError && (
                    <div className="flex items-center text-red-500 text-xs">
                      <span className="mr-1">⚠</span> {tagError}
                    </div>
                  )}
              <div
                className={`relative w-full h-48 border-2 mt-4 border-dashed rounded-lg flex items-center justify-center ${
                  imageError ? 'border-red-500' : 'border-gray-300'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full cursor-pointer object-cover rounded-lg"
                      onClick={() => handleImageClick(imagePreview)}
                    />
                    <button
                      className="absolute top-4 right-4 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:text-red-600"
                      onClick={handleImageDelete}
                      type="button"
                    >
                      <DeleteIcon size={23} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">
                      Drag and Drop or{' '}
                      <label className="text-blue-500 cursor-pointer hover:underline">
                        upload media <CloudDownload className="inline" />
                        <input
                          type="file"
                          accept="image/*"  
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </p>
                  </div>
                )}
              </div>
              {imageError && (
                <div className="flex items-center mt-1 text-red-500 text-xs">
                  <span className="mr-1">⚠</span> {imageError}
                </div>
              )}

              <div className="mt-4">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="Enter blog content"
                />
              </div>

              <div className="mt-2 flex justify-center">
                <button
                  className="border-dashed rounded-md border-2 border-gray-200 text-md py-2 px-2"
                  type="submit"
                  title='create post'
                >
                   Post <CloudDownload className="inline"/>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {selectedImage && (
        <div style={styles.overlay} onClick={closeModal}>
          <img
            src={selectedImage}
            alt="Large View"
            style={styles.largeImage}
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}

    </div>
  );
}

export default AddBlog;