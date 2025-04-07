import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CiLogout } from "react-icons/ci";


function Logout({ role }) {

    const navigate = useNavigate();

    const handleLogout = () => {

      if (role === 'admin'){
        localStorage.removeItem('access')
        navigate('/admin/login')

      } else if (role === 'theatre'){
        localStorage.removeItem('theatre_token')
        navigate('/theatre/login')
      }
    }

  return (
    <button  onClick={handleLogout}>
        logOut<span><CiLogout /></span>
    </button>
  )
}
export default Logout
