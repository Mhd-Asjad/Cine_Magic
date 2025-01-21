import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CiLogout } from "react-icons/ci";


function Logout() {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/admin/login')
    }
  return (
    <button  onClick={handleLogout}>
        logOut <CiLogout/>
    </button>
  )
}

export default Logout
