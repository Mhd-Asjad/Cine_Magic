import React, { useState } from 'react';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import { jwtDecode } from 'jwt-decode';
import google from '../../assets/google_logo.png'
import { GoogleOAuthProvider , GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser_id , setUsername , setEmail } from '@/Redux/Features/UserSlice';
import { useToast } from '@/hooks/use-toast';
function AuthContainer({ setIsOtpSent , setUserEmail , isModalClose }) {
    const [isRegister, setIsRegister] = useState(true);
    const [ isLogin , setIsLogin ] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {toast} = useToast();
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const toggleForm = () => {
        setIsRegister((prev) => !prev);
    };

    const handleGoogleSuccess = async (credentialresponse) => {
        const decoded = jwtDecode(credentialresponse.credential)
        console.log(decoded);
        const {email , name } = decoded
        try {
            const res = await axios.post('http://127.0.0.1:8000/user_api/google-auth/',{
                'email' : email , 
                'username' : name
            })
            const {id , userEmail , username } = res.data.user
            console.log(userEmail)

            dispatch(setUser_id(id))
            dispatch(setEmail(userEmail))
            dispatch(setUsername(username))

            console.log("Google Auth Response:", res.data);
            if (res.data.success) {
                isModalClose()
            }
            toast({
                title : 'google logineed successfully',
                
            })
        }catch(e) {
            console.log('google Authentication error' , e.response?.data || e.message)
        }
    }

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>

            <div className="container mx-auto p-6">
                {isRegister ? (
                    <RegistrationForm
                        setMessage={() => {}}
                        setIsOtpSent={setIsOtpSent}
                        setUserEmail={setUserEmail}
                    />
                ) : (
                    <LoginForm isModalClose={isModalClose} />
                )}
                <p className="text-center mt-4">
                    {isRegister ? (

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
