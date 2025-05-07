import React, { useCallback, useEffect , useState } from "react";
import { Navigate , useNavigate } from 'react-router-dom'
import { ACCESS_TOKEN , REFRESH_TOKEN } from "../../constants";
import {jwtDecode} from 'jwt-decode'
import userApi from "@/Axios/userApi";

function PrivateRoute({ children }) {
    
    const [isAuthenticated , setIsAuthenticated ] = useState(false);
    const navigate = useNavigate();
    const currentRole = localStorage.getItem('current_user_type')

    
    const isExpiringSoon = useCallback((token) => {
        try {
            const tokenDecoded = jwtDecode(token)
            const tokenexp = tokenDecoded.exp
            const now = Date.now() / 1000
            return tokenexp - now < 180
        }catch(error){
            console.log(error)
            return true
        }

    },[])

    const refreshToken = useCallback(async () => {
        const refreshToken = localStorage.getItem(`${currentRole}_token_refresh`);
        
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
        const access_token = localStorage.getItem(`${currentRole}_token`)
        if (!access_token) {
            setIsAuthenticated(false)
            return
        }
        try {
            console.log(' access token is validating')
            
            const decode = jwtDecode(access_token)
            const tokenExpiration = decode.exp
            console.log(tokenExpiration)
            const now = Date.now() / 1000
            if (tokenExpiration < now ){
                const refreshSuccessful  = await refreshToken()
                console.log(refreshSuccessful , 'token revalidation')
                setIsAuthenticated(refreshSuccessful)
                
            }else if (isExpiringSoon(access_token)){
                refreshToken().catch(console.error)
                setIsAuthenticated(true)

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
        }
        
    },[currentRole , refreshToken , isExpiringSoon])
    
    
    useEffect(() => {
        check_auth().catch((e) => e.message)
        console.log('accessing every two minitues')
        console.log("PrivateRoute mounted with auth state:", { 
            isAuthenticated, 
            currentRole,
            hasAccessToken: !!localStorage.getItem(`${currentRole}_token`)
          });
      
        const check_token_exp = setInterval(() => {
            const access_token = localStorage.getItem(`${currentRole}_token`)
            if (access_token && isExpiringSoon(access_token)) {
                refreshToken().catch(console.error)
            }

        },20000)

        return () => clearInterval(check_token_exp)

    },[check_auth , currentRole , isExpiringSoon , refreshToken ])
    console.log(isAuthenticated)
    console.log(currentRole)
    // if(isAuthenticated === false) {
    //     const redirectPath = currentRole === 'user' ? '/' : `/${currentRole}/login`;
    //     return <Navigate to={redirectPath} replace />;  
    // }
    return children;
}
export default PrivateRoute