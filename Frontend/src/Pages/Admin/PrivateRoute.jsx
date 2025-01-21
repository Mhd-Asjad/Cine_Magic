import React from "react";
import { Navigate } from 'react-router-dom'


function PrivateRoute({ children }) {
    const token = localStorage.getItem('token')
    console.log(token,'token')

    if (!token) {

        return <Navigate to="/admin/login" replace/>
    }else{
        return children
    }
}
export default PrivateRoute