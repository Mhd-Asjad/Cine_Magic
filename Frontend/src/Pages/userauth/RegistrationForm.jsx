import React , {useEffect, useState} from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import userApi from '@/Axios/userApi';

function RegistrationForm({ setMessage, setUserPrevillage ,  setIsOtpSent, setUserEmail }) {
    
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
                .min(6, 'Password must be at least 6 characters long')
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

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Register User</h2>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
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
                        className={`mt-1 block w-full px-3 py-2 border ${
                            formik.touched.username && formik.errors.username
                                ? 'border-red-500'
                                : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {formik.touched.username && formik.errors.username && (
                        <p className="text-red-500 text-sm">{formik.errors.username}</p>
                    )}
                    
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter email"
                        className={`mt-1 block w-full px-3 py-2 border ${
                            formik.touched.email && formik.errors.email
                                ? 'border-red-500'
                                : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-sm">{formik.errors.email}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter password"
                        className={`mt-1 block w-full px-3 py-2 border ${
                            formik.touched.password && formik.errors.password
                                ? 'border-red-500'
                                : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-sm">{formik.errors.password}</p>
                    )}
            </div>

                <button
                    type="submit"
                    className="mx-auto flex justify-center w-[17%] py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg ho :bg-blue-700"
                    disabled={formik.isSubmitting}
                >
                    {formik.isSubmitting ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
}

export default RegistrationForm;
