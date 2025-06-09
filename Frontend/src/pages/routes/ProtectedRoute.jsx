import React, { Children } from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentUser } from '../userauth/AuthService'


export const UserRoute = ({children}) => {
    const user = getCurrentUser()

    console.log(user)
    if (!user){
        return <Navigate to={'/'} />
    }

    if (user.userType === 'user' || user.userType === 'theatre' || user.userType === 'admin' ){
        return children
    }
}


export const TheatreRoute = ({ children }) => {
    const user = getCurrentUser();
    console.log(!user)
    
    console.log('inside theatre route')
    if (!user) {
        return <Navigate to="/theatre/login" />;
    }
    
    if (user.userType === 'theatre') {
        return children;
    }
    if (user.userType !== 'theatre') {
        return <Navigate to="/theatre/login" />;
    }
    
}

export const AdminRoute = ({ children }) => {
    const user = getCurrentUser();
    
    if (!user) {
        return <Navigate to="/admin/login" />;
    }

    if (user.userType === 'admin') {
        return children;
    }
    
    if (user.userType === 'user') {
        return <Navigate to="/" />;
    }
    
    if (user.userType === 'theatre') {
        return <Navigate to="/theatre-owner/dashboard" />;
    }
    
    return <Navigate to="/admin/login" />;
};
