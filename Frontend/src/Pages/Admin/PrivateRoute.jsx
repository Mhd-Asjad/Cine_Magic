import React, { useCallback, useEffect , useState } from "react";
import { Navigate , useNavigate } from 'react-router-dom'
import { ACCESS_TOKEN , REFRESH_TOKEN } from "../../constants";
import apiAdmin from "../../Axios/api";
import {jwtDecode} from 'jwt-decode'

function PrivateRoute({ children }) {
    
    const [isAuthenticated , setIsAuthenticated ] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        check_auth().catch((e) => e.message)
    },[navigate , setIsAuthenticated])

    const refreshtoken = useCallback(async () => {
        const refreshtoken = localStorage.getItem(REFRESH_TOKEN)
        if (!refreshtoken) {
            setIsAuthenticated(false)
            navigate('/admin/login')
            return;
        }
        try {
            const res = await apiAdmin.post('token/refresh/', {
                'refresh' : refreshtoken
            });
            const newAccessToken = res.data.access
            console.log(newAccessToken,'refreshed token')
            localStorage.setItem(ACCESS_TOKEN , newAccessToken)
            setIsAuthenticated(true)
        }catch(error){
            console.log('token expaired canot be refresheeddd')
            console.log(error)
            setIsAuthenticated(false)
            navigate('/admin/login')
        } 
    },[])


    const check_auth = useCallback(async() => {
        const access_token = localStorage.getItem(ACCESS_TOKEN)
        if (!access_token) {
            setIsAuthenticated(False)
            navigate('/admin/login')
            return
        }
        try {
            console.log('i am getting in to this for new access ton')

            const decode = jwtDecode(access_token)
            const tokenExpiration = decode.exp
            const now = Date.now() / 1000

            if (tokenExpiration < now ){
                console.log('token expired , refreshing......')
                await refreshtoken()

            }else {
                
                setIsAuthenticated(true)
            }

        }catch(e){
            console.log(e.response.data)
            setIsAuthenticated(false)
            navigate('/admin/login')
            return
        }
        
    },[])


    if(!isAuthenticated ) {
        return <div className="flex justify-center" >loading...</div>
    }else {
        return isAuthenticated ? children : <Navigate to="login" />;
    }
}
export default PrivateRoute