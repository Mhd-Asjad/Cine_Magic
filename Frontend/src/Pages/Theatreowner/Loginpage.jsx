import React , {useEffect, useState } from 'react'
import { useDispatch } from "react-redux";
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { useNavigate } from 'react-router-dom';
import Squares from '../ReactBits/Squares';
import login from '../userauth/AuthService';
function Loginpage() {
  
  const [formData , setFormData ] = useState({username : '' , password : '' , user_type : 'theatre'});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  toastr.options = {
    positionClass : "toast-top-right",
    hideDuration : 300,
    timeOut : 3000,
    closeButton : true
  }

  const handleChange = (e) => {
    setFormData({ ...formData , [e.target.name] : e.target.value })
  }
  console.log(formData)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await login( dispatch , formData.username , formData.password , formData.user_type)
      navigate('/theatre-owner/dashboard')
    } catch (e) {
      console.log(e)
      console.log(e.response?.data?.error || 'an eroor occurs')
      toastr.error(e.response?.data?.error || 'an error occur')
    }
  };
  return (
      <div className="reletive h-screen bg-black ">
        <Squares 
          speed={0.5} 
          squareSize={40}
          direction='diagonal'
          borderColor='#777'
          hoverFillColor='#444'
        />
       <div className='absolute pointer-events-none inset-0 flex justify-center items-center z-10' >

       <div className="bg-white/15 backdrop-blur-xl pointer pointer-events-auto p-8 rounded-lg shadow-lg w-96 z-10">
          <h2 className="text-white text-2xl font-semibold text-center mb-6">
              🎭 Theatre Owner Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
              <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg  text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg  text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-300">
                  Login
              </button>
          </form>
          
          <p className="text-gray-400 text-sm text-center mt-4">
              Forgot password? <a href="/reset" className="text-blue-400 hover:underline">Reset here</a>
          </p>
      </div> 
   

       </div>
  </div>
  )
  
}
export default Loginpage
