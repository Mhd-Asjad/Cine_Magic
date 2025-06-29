import React , {useEffect, useState} from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import userApi from '@/axios/userApi';
import { Eye, EyeOff, User, Mail, Lock, CheckCircle } from 'lucide-react';
import bg from '../../assets/cinelogo.png'
import { useSelector } from 'react-redux';

function RegistrationForm({ setMessage ,  setIsOtpSent, setUserEmail }) {
    const [touched, setTouched] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const user = useSelector(state => state.user)
    
    const [ errors , setErrors ] = useState('')
    toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-top-right", 
        "timeOut": "5000", 
    }
    
    useEffect(() => {
        if (errors.username) {
            toastr.error(errors.username) 
        }
        if (errors.email){
        toastr.warning(errors.email)
        }

    },[errors])
    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''


        },
        validationSchema: Yup.object({
            username: Yup.string()
                .required('Username is required')
                .min(3, 'Username must be at least 3 characters long'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .required('Password is required')
                .min(6, 'Password must be at least 6 characters long'),
            confirmPassword: Yup.string()
                .required('Confirm Password is required')
                .oneOf([Yup.ref('password'), null], 'Passwords must match'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            
            try {
                const res = await userApi.post('register/',values);
                toastr.success('Registration successful! Please check your email for OTP.');
                setUserEmail(values.email);
                setIsOtpSent(true);
                setUserPrevillage({
                    is_approved : false ,
                    is_admin : false ,
                    is_theatre : false 
                })
                
            } catch (error) {
                if (error.response && error.response.data) {
                    setErrors(error.response.data);
                } else {
                    toastr.error("Something went wrong. Please try again.");
                }
                
            } finally {
                setSubmitting(false);
            }
        },
    });
    console.log('is_owner ',user.is_theatre_owner , 'is approved' , user.is_approved)
    return (
        <div className="border p-5 shadow-lg w-full max-w-6xl grid grid-cols-1 md:grid-cols-2">
            <div>

           
            <form onSubmit={formik.handleSubmit} className=" ">
                <div>
                    <label htmlFor="username" className="block text-sm mt-2 font-medium text-gray-700">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter username"
                        className={` block px-3 py-2 border w-full ${
                            formik.touched.username && formik.errors.username
                                ? 'border-red-500'
                                : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {formik.touched.username && formik.errors.username && (
                        <p className="text-red-500 text-sm">{formik.errors.username}</p>
                    )}
                </div>

                <div >
                    <label htmlFor="email" className="block text-sm mt-2 font-medium text-gray-700">
                       Email

                    </label>
                    <div className='reletive' >

                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter email"
                        className={` block w-full px-3 py-2 border ${
                            formik.touched.email && formik.errors.email
                                ? 'border-red-500'

                                : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                 </div>                    
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-sm">{formik.errors.email}</p>
                    )}
                </div>

                <div className="relative"> 
                    <label htmlFor="password" className="block text-sm mt-2 font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type={showPassword ? 'text' : "password"}
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter password"
                        className={`block px-3 py-2 border w-full ${
                            formik.touched.password && formik.errors.password
                                ? 'border-red-500'
                                : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 pt-5 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                        <EyeOff size={18} className="text-gray-400" />
                        ) : (
                        <Eye size={18} className="text-gray-400" />
                        )}
                    </button>
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-sm">{formik.errors.password}</p>
                    )}


             </div>

             <div>
                <label htmlFor="confirmPassword" className="block text-sm mt-2 font-medium text-gray-700 mb-1">
                Confirm Password
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CheckCircle size={18} className="text-gray-400" />
                    </div>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Confirm your password"
                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? (
                        <EyeOff size={18} className="text-gray-400" />
                        ) : (
                        <Eye size={18} className="text-gray-400" />
                        )}
                    </button>
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{ formik.errors.confirmPassword}</p>
                )}
                </div>
                <div className="flex items-center justify-between mt-4">
                    <button
                        type="submit"
                        className="mx-auto font-medium w-full py-2 rounded-md px-2 text-white bg-black"
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? 'Registering...' : 'Register'}
                    </button>

                </div>
            </form>

        </div>

        <div className="ml-3 bg-white flex flex-col justify-center items-center ">
            <img src={bg} className='w-full object-cover' alt="" />
        </div>

        </div>
    );
}

export default RegistrationForm;
