import React, { useState } from 'react';
import RegistrationForm from './RegistrationForm';
// import LoginForm from './LoginForm';
import { jwtDecode } from 'jwt-decode';
import { GoogleOAuthProvider , GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser_id , setUsername , setPrevilage , setEmail } from '@/redux/features/UserSlice';
import { useToast } from '@/hooks/use-toast';
import userApi from '@/axios/userApi';
import { GalleryVerticalEnd } from "lucide-react";
import {LoginForm} from "@/components/login-form";
import ResetPassword from './ResetPassword';

function AuthContainer({ setIsOtpSent , setUserEmail , isModalClose , Logined }) {
    const [ isLogin , setIsLogin ] = useState(true)
    const [isResetPassowrd , setResetPaword ] = useState(false);
    const dispatch = useDispatch();
    const {toast} = useToast();
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const toggleForm = () => {
        
        setIsLogin(prev => (!prev))
    };

    const togglePassword = () => {
        setResetPaword(prev => (!prev))
        setIsLogin(prev => (!prev))
    }
    useState(() => {
        if (Logined){
            console.log('is logined')
            setIsLogin(true)
        }
    },[])
    const handleGoogleSuccess = async (credentialresponse) => {
        const decoded = jwtDecode(credentialresponse.credential)
        console.log(decoded);
        const {email , name } = decoded
        try {
            const res = await userApi.post('google-auth/',{
                'email' : email ,
                'username' : name
            })
            const { refresh_token , access_token , id , userEmail , username , is_approved , is_theatre_owner } = res.data.user
            console.log(refresh_token , access_token)
            localStorage.setItem('user_token' , access_token)
            localStorage.setItem('user_token_refresh',refresh_token)
            localStorage.setItem('current_user_type' , 'user')
            dispatch(setUser_id(id))
            dispatch(setEmail(userEmail))
            dispatch(setUsername(username))
            dispatch(setPrevilage({
                is_approved : is_approved,
                is_theatre : is_theatre_owner,
            }))
            console.log("Google Auth Response:", res.data);
            if (res.data.success) {
                isModalClose()
            }
            toast({
                title : 'google authenticatin verified',
                
            })
        }catch(e) {
            console.log('google Authentication error' , e.response?.data || e.message)
        }
    }

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>

            <div className="container mx-auto p-6">
                {isLogin ? (
                    
                    <LoginForm isModalClose={isModalClose} handleResetForm={togglePassword} google_success={handleGoogleSuccess} />
                    
                ) :  isResetPassowrd ? (
                    <ResetPassword handleResetForm={togglePassword} />
                ) :(
                    
                    <RegistrationForm
                        setIsOtpSent={setIsOtpSent}
                        setUserEmail={setUserEmail}
                    />

                ) }


                
                <p className="text-center mt-2">
                    {!isLogin && !isResetPassowrd ? (
                        <>
                        
                            Already have acoount?{' '}
                            <span
                                className="underline cursor-pointer underline-offset-4"
                                onClick={toggleForm}
                            >
                                login
                            </span>
                        </>

                    ) : !isResetPassowrd ? (

                        <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <a onClick={toggleForm} className="underline cursor-pointer underline-offset-4">
                                Sign up
                            </a>
                        </div>

                        
                    ):null}
                </p>
            </div>


        </GoogleOAuthProvider>
    );
}

export default AuthContainer;
