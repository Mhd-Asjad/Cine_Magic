import React from 'react'
import { Outlet , Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('theatre_token')
    console.log(isAuthenticated , 'check Authenticity')
    return isAuthenticated ? children : <Navigate to="/theatre/login" />
}

export default PrivateRoute
