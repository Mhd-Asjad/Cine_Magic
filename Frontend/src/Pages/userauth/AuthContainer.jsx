import React, { useState } from 'react';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import { jwtDecode } from 'jwt-decode';
import { GoogleOAuthProvider , GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser_id , setUsername , setPrevilage , setEmail } from '@/Redux/Features/UserSlice';
import { useToast } from '@/hooks/use-toast';
import userApi from '@/Axios/userApi';

function AuthContainer({ setIsOtpSent , setUserEmail , isModalClose , Logined }) {
    const [ isLogin , setIsLogin ] = useState(true)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {toast} = useToast();
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID  
    const toggleForm = () => {
        
        setIsLogin(prev => (!prev))
    };
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
            const { refresh_token , access_token , id , userEmail , username } = res.data.user
            console.log(refresh_token , access_token)
            localStorage.setItem('user_token' , access_token)
            localStorage.setItem('user_token_refresh',refresh_token)
            localStorage.setItem('current_user_type' , 'user')
            dispatch(setUser_id(id))
            dispatch(setEmail(userEmail))
            dispatch(setUsername(username))



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
                    <LoginForm isModalClose={isModalClose} />
                ) :  (
                    <RegistrationForm
                        setMessage={() => {}}
                        setIsOtpSent={setIsOtpSent}
                        setUserEmail={setUserEmail}
                        setUserPrevillage={setPrevilage}
                    />
                )}
                <p className="text-center mt-2">
                    {!isLogin ? (

                        <>
                            Already have an account?{' '}
                            <span
                                className="text-blue-500 cursor-pointer hover:underline"
                                onClick={toggleForm}
                            >
                                Login
                            </span>
                        </>
                    ) : (

                        <>
                            Don't have an account?{' '}
                            <span
                                className="text-blue-500 cursor-pointer hover:underline"
                                onClick={toggleForm}
                            >
                                Register
                            </span>

                                <p> <span className='text-sm text-gray-500' > OR </span></p>
                                <div className='flex items-center justify-center py-3 px-5 w-2/5 h-12 mx-auto mt-3 rounded-md cursor-pointer' > 
                                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log("Login Failed")} />
                                </div>

                        </>
                        
                    )}
                </p>
            </div>


        </GoogleOAuthProvider>
    );
}

export default AuthContainer;
