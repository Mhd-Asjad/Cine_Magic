import React from 'react'
import { Outlet , Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const userType = localStorage.getItem('current_user_type')
    const isAuthenticated = localStorage.getItem(`${userType}_token`)
    return isAuthenticated ? children : <Navigate to="/theatre/login" />
}

export default PrivateRoute
