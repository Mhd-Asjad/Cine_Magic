import React, { useState } from 'react';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import { FaGoogle } from "react-icons/fa6";


function AuthContainer({ setIsOtpSent , setUserEmail , isModalClose }) {
    const [isRegister, setIsRegister] = useState(true);
    const [ isLogin , setIsLogin ] = useState(false)

    const toggleForm = () => {
        setIsRegister((prev) => !prev);
    };

    return (
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

                            <p> <span className='text-sm text-gray-500' > OR</span></p>
                        <div className='bg-black py-3 w-[40%] mx-auto mt-3 rounded-md' > 
                            <p className='text-white' >Sign in with google </p>
                            <FaGoogle  className='text-white text-3xl' />
                            

                        </div>

                    </>
                    
                )}
            </p>
        </div>
    );
}

export default AuthContainer;
