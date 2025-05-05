import React, { useCallback, useEffect , useState } from "react";
import { Navigate , useNavigate } from 'react-router-dom'
import { ACCESS_TOKEN , REFRESH_TOKEN } from "../../constants";
import {jwtDecode} from 'jwt-decode'
import userApi from "@/Axios/userApi";

function PrivateRoute({ children }) {
    
    const [isAuthenticated , setIsAuthenticated ] = useState(null);
    const navigate = useNavigate();
    const currentRole = localStorage.getItem('current_user_type')

    useEffect(() => {
        check_auth().catch((e) => e.message)
    },[navigate , setIsAuthenticated])

    const refreshtoken = useCallback(async () => {
        const refreshtoken = localStorage.getItem(`${currentRole}_token_refresh`)
        if (!refreshtoken) {
            setIsAuthenticated(false)
            navigate()
            return;
        }
        try {
            const res = await userApi.post('token/refresh/', {
                'refresh' : refreshtoken
            });
            const newAccessToken = res.data.access
            console.log(newAccessToken,'refreshed token')
            localStorage.setItem(`${currentRole}_token` , newAccessToken)
            setIsAuthenticated(true)
        }catch(error){
            console.log('token expaired canot be refresheeddd')
            console.log(error)
            setIsAuthenticated(false)
            navigate(currentRole === 'user' ? '/' :`/${currentRole}/login`)
        } 
    },[])

    const check_auth = useCallback(async() => {
        const access_token = localStorage.getItem(`${currentRole}_token`)
        if (!access_token) {
            setIsAuthenticated(false)
            console.log('ivde ndd')
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
        return isAuthenticated ? children : <Navigate to={`/${currentRole}/login`} />;
    }
}
export default PrivateRoute