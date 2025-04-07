import React , {useEffect, useState } from 'react'
import { useDispatch } from "react-redux";
import TheatreApi from '@/Axios/theatreapi';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { setTheatreOwner } from '../../Redux/Features/Theatreownerslice';
import { useNavigate } from 'react-router-dom';

function Loginpage() {
  
  const [formData , setFormData ] = useState({username : '' , password : ''});
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await TheatreApi.post('/theatre-login/' ,
        formData ,
        { headers: { "Content-Type": "application/json" } }
      )
      console.log(formData)
      console.log(response.data)
      const {access_token , refresh_token ,  theatre_owner } = response.data

      localStorage.setItem('theatre_token' , access_token )
      localStorage.setItem('refresh_token',refresh_token)
      console.log(theatre_owner.owner_id)

      
      dispatch(setTheatreOwner({
        owner_id : theatre_owner.owner_id,  
        theatreId : theatre_owner.id ,
        theatreName : theatre_owner.theatre_name,
        location : theatre_owner.location ,
        state : theatre_owner.state ,
        pincode : theatre_owner.pincode ,
        ownership_status :  'pending '

      }));
      navigate('/theatre-owner/dashboard')

    } catch (e) {
      console.log(e.response)
      toastr.error(e.response?.data?.error || 'an error occur')
      console.log(e.response?.data?.error || 'an eroor occurs')

    }
  };
  return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
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
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
  )
  
}
export default Loginpage
