import React, { useState } from "react";
import Nav from "../../Components/Navbar/Nav";
import Footer from "../../Components/Footer/footer";
import { useSelector } from "react-redux";
import probg from '../../assets/profilebg1.jpg'
import { TbLogout2 } from "react-icons/tb";
import { FaAngellist } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";


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
  const [ theatreName , setTheatreName ] = useState('');
  const [ location , setLocation ] = useState('');
  console.log(location)
  const [ state , setState ] = useState('');
  const [pincode , setPincode ] = useState('');
  const [ text , setText ] = useState('');
  const userId = useSelector((state) => state.user.id)
  console.log(userId)
  const [ errors , setErrorMessage ] = useState({});
  const username = useSelector((state) => state.user.username)
  const email = useSelector((state) => state.user.email)
  const handleToggleForm = () => {
    setShowContactForm(!showContactForm);
  };

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
        'theatre_name' : theatreName ,
        'location' : location , 
        'state' : state , 
        'pincode' : pincode , 
        'user_message' : text
      });
      

      handleSuccess(response.data.message)

      
    }catch(e) {

      const error = e.response.data.error;
      
      toastr.warning(error)

    }
  };

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
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-gray-700">
                Theatre Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border rounded"
                placeholder="Enter your name"
                onChange={(e) => setTheatreName(e.target.value)}
              />
              {errors.theatreName && (
                <p className="text-red-500 text-sm font-semibold">{errors.theatreName}</p>
              )}
              <label className="block mt-4 text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border rounded"
                placeholder="Enter your email"
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
        <div className="flex gap-1 py-3 px-4 bg-gray-50 rounded shadow-sm hover:bg-gray-100 cursor-pointer">
          <FaAngellist className="text-2xl text-gray-500" /> Blogs
        </div>
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
