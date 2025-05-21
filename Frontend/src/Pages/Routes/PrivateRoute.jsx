import React, { useCallback, useEffect , useState } from "react";
import { Navigate , useNavigate } from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'
import Logout from "@/Components/Admin/Logout";
import userApi from "@/Axios/userApi";

function PrivateRoute({ children , allowedTypes }) {
    
    const [isAuthenticated , setIsAuthenticated ] = useState(false);
    const [loading , setLoading ] = useState(true)
    const currentRole = localStorage.getItem('current_user_type')

    const refreshToken = useCallback(async () => {
        const refreshToken = localStorage.getItem(`${currentRole}_token_refresh`);
        console.log('token refreshing')
        if (!refreshToken) {
          return false;
        }
        
        try {
            const res = await userApi.post('token/refresh/', {
                'refresh': refreshToken
            });
            
            const newAccessToken = res.data.access;
            localStorage.setItem(`${currentRole}_token`, newAccessToken);
            return true;
        } catch (error) {
            console.error('Token refresh failed:', error?.response?.data || error.message);
            return false;
        }
    }, [currentRole]);
    
    const check_auth = useCallback(async() => {
        const refreshtok = localStorage.getItem(`${currentRole}_refresh_token`);
        const access_token = localStorage.getItem(`${currentRole}_token`)
        console.log(refreshtok)
        if (!refreshToken) {
            console.log('no refresh token found')
            setIsAuthenticated(false)
            setLoading(false)
            return
        }
        try {

            const decode = jwtDecode(access_token)
            const tokenExpiration = decode.exp
            const now = Date.now() / 1000
            if (tokenExpiration < now ){
                const refreshSuccessful  = await refreshToken()
                console.log(refreshSuccessful , 'token revalidation')
                setIsAuthenticated(refreshSuccessful)

            }else {
                console.log('token validateeddd')
                setIsAuthenticated(true)
            }
            
        }catch(e){
            console.log(e.message , 
                'token validation error '
            )
            setIsAuthenticated(false)
            return
        }finally {
            setLoading(false)
        }
        
    },[currentRole , refreshToken])
    
    useEffect(() => {
        check_auth().catch((e) => e.message)

    //     return () => clearInterval(check_token_exp)

    },[check_auth , currentRole , refreshToken ])
    console.log(isAuthenticated)
    console.log(currentRole , 'before invalid token')


    const redirectPath = allowedTypes === 'user' ? '/' : `/${allowedTypes}/login`;
    
    if (loading) {
        return <div className="flex justify-center text-center h-screen" >Loading.....</div>
    }
    console.log(redirectPath)
    if(!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;  
    }
    return children;
}
export default PrivateRoute