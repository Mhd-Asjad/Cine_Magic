import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { Formik, Field, Form } from 'formik';
import { setUsername , setEmail } from '../../Redux/Features/UserSlice';
import { useDispatch  } from 'react-redux';
function OtpVerificationForm({ email, setMessage , closeModal }) {

  toastr.options = {
    "closeButton": true,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "timeOut": "5000",
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOtpSubmit = async (values, { setSubmitting, setErrors }) => {
    if (!values.otp) {
      toastr.warning('Please enter your OTP');
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/user_api/verify_otp/', {
        email: email,
        otp: values.otp,
      });

      setMessage(response.data.message);
      console.log(response.data.user.username)
      console.log(response.data.user.email)
      dispatch(setUsername(response.data.user.username))
      dispatch(setEmail(response.data.user.email))
      toastr.success(response.data.message);
      closeModal()
      navigate('/');
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Unexpected error occurred';
      toastr.error(errorMessage);
      setErrors({ otp: errorMessage });
    }

    setSubmitting(false);
  };


  return (
    <div>
      <h2 className="flex justify-center text-xl font-semibold mb-4">Verify OTP</h2>

      <Formik
        initialValues={{ otp: '' }}
        validateOnBlur={false}
        validate={(values) => {
          const errors = {};
          if (!values.otp) {
            errors.otp = 'OTP is required';
          } else if (!/^\d{6}$/.test(values.otp)) {
            errors.otp = 'OTP must be exactly 6 digits';
          }
          return errors;
        }}
        onSubmit={handleOtpSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                OTP:
              </label>

              <Field
                type="text"
                name="otp"
                placeholder="Enter OTP"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.otp && <div className="text-red-600 mt-1">{errors.otp}</div>}
            </div>

            <button
              type="submit"
              className="flex mx-auto mt-6 py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
            >
              {isSubmitting ? 'Verifying...' : 'Verify OTP'}
            </button>
            
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default OtpVerificationForm;
