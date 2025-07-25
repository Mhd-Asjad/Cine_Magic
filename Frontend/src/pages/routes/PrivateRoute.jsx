import React, { useCallback, useEffect , useState } from "react";
import { Navigate , useNavigate } from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'
import userApi from "@/axios/userApi";
import { useDispatch } from "react-redux";
import { logout } from "../userauth/AuthService";
import { performLogout } from "./performLogout";
import SessionExpiredDialog from "./SessionExpiredDialog";
function PrivateRoute({ children , allowedTypes }) {
    
    const [isAuthenticated , setIsAuthenticated ] = useState(false);
    const [loading , setLoading ] = useState(true)
    const [showDialog, setShowDialog] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isAuthenticated) {
            setShowDialog(true);
        }
    }, [isAuthenticated]);


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
            localStorage.removeItem(`${currentRole}_token`);
            localStorage.removeItem(`${currentRole}_token_refresh`);
            localStorage.removeItem('current_user_type');


            return false;
        }

    }, [currentRole]);
    
    const check_auth = useCallback(async() => {
        const refreshtok = localStorage.getItem(`${currentRole}_token_refresh`);
        const access_token = localStorage.getItem(`${currentRole}_token`)
        console.log(refreshtok)
        if (!refreshtok) {
            console.log('no refresh token found')
            setIsAuthenticated(false)
            setLoading(false)
            return;
        }

        if (!access_token) {
            console.log('no access token is found , try to refreshing......')
            const refreshSuccessful = await refreshToken();
            setIsAuthenticated(refreshSuccessful)
            setLoading(false);
            return;
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
            const refreshSuccessful = await refreshToken();

            setIsAuthenticated(refreshSuccessful)
            return
        }finally {
            setLoading(false)
        }
        
    },[currentRole , refreshToken , allowedTypes])
    
    useEffect(() => {
        check_auth().catch((e) => e.message)

    },[check_auth , currentRole , refreshToken ])


    console.log('user is authenticated :',isAuthenticated )
    
    if (loading) {
        return <div className="flex justify-center h-screen" >Loading.....</div>
    }

    const handleDialogConfirm = () => {
        performLogout(dispatch,navigate , allowedTypes);
    }

    if(!isAuthenticated) {
        return <SessionExpiredDialog open={showDialog} onConfirm={handleDialogConfirm} />
    }

    return children;
}

export default PrivateRoute