import React, { useState } from "react";
import Nav from "../../Components/Navbar/Nav";
import Footer from "../../Components/Footer/footer";
import { useSelector } from "react-redux";
import probg from '../../assets/profilebg1.jpg'
import { TbLogout2 } from "react-icons/tb";
import { FaAngellist } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { FaUserEdit } from "react-icons/fa";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { useDispatch } from "react-redux";
import { setUsername , setEmail } from "@/Redux/Features/UserSlice";
import { useToast } from "@/hooks/use-toast";
import { use } from "react";
import LocationPicker from "@/Components/Map/LocationPicker";
import 'leaflet/dist/leaflet.css';
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
  const [ theatreName , setTheatreName ] = useState('');
  const [ ownerImage , setOwnerImage ] = useState('')
  const [ location , setLocation ] = useState('');
  const [ state , setState ] = useState('');
  const [pincode , setPincode ] = useState('');
  const [latitude , setLatitude ] = useState('')
  const [ longitude , setLongitude ] = useState('') 
  const [ text , setText ] = useState('');

  const userId = useSelector((state) => state.user.id)
  const [ errors , setErrorMessage ] = useState({});
  const username = useSelector((state) => state.user.username)
  const email = useSelector((state) => state.user.email)
  const [newUsername , setNewUsername ] = useState('');
  const [newEmail , setNewEmail ] = useState('');
  const {toast} = useToast();
  const dispatch = useDispatch();
  const handleToggleForm = () => {
    setShowContactForm(!showContactForm);
  };
  const handleToggleForm1 = () => {
    setShowEditForm(!showEditForm)
    setNewUsername(username)
    setNewEmail(email)
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

      const response = await axios.post('http://127.0.0.1:8000/theatre_owner/create_profile/', {
        'user' : userId ,
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
      headers: { 'Content-Type': 'multipart/form-data' },
    });
      

      handleSuccess(response.data.message)

      
    }catch(e) {

      const error = e.response?.data?.user || e.response.data.error;
      console.log(error)
      toastr.warning(error)

    }
  };

  const handleUserEdit = async(e) => {
    e.preventDefault()
    try {
      const res = await axios.put(`http://127.0.0.1:8000/user_api/edit-user/${userId}/`,{
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
  console.log(ownerImage)
  return (  
    <div>

      <Nav/>
    <div className="bg-white shadow-md flex flex-col items-center">
      <img className="reletive w-full h-20"  src={probg} alt="" />
      <div className="absolute mt-8 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-4xl text-white">
        <span>👤</span>
      </div>
      <div className="text-center mt-4 p-2" >

      <h1 className="text-xl font-semibold text-gray-800">{username}</h1>
      <p className="text-gray-500 text-sm">{email}</p>
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
          <div className="mt-4 bg-gray-50  p-4 rounded shadow-sm">
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
        >
          <FaAngellist className="text-2xl text-gray-500" /> Blogs
        </div>
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
