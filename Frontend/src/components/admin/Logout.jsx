import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CiLogout } from "react-icons/ci";
import { logout } from '@/pages/userauth/AuthService';
import { useDispatch  } from 'react-redux';
import { resetUser } from '@/redux/features/UserSlice';
import { clearNotifications } from '@/redux/features/notificationSlice';
function Logout() {
  

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {

      const userType = localStorage.getItem('current_user_type')
      logout()
      dispatch(resetUser())
      dispatch(clearNotifications())
      navigate(`/${userType}/login`)
    }
  return (
    <button  onClick={handleLogout}>
        logOut<span><CiLogout /></span>
    </button>
  )
}
export default Logout
