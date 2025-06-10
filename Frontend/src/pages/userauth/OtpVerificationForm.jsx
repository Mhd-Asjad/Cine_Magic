import React from 'react';
import { useNavigate } from 'react-router-dom';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import { Formik, Form } from 'formik';
import { setUsername, setEmail, setUser_id } from '../../redux/features/UserSlice';
import { useDispatch } from 'react-redux';
import userApi from '@/axios/userApi';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import CountDownTimer from '../seatselection/CountDownTimer';

function OtpVerificationForm({ email, setMessage, closeModal }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const now = new Date();
  const twoMinutesLater = new Date(now.getTime() + 2 * 60 * 1000);

  const handleOtpSubmit = async (values, { setSubmitting, setErrors }) => {
    if (!/^\d{6}$/.test(values.otp)) {
      toastr.warning('OTP must be contain valid numbers');
      setSubmitting(false);
      return;
    }

    try {

      const response = await userApi.post('verify_otp/', {
        email,
        otp: values.otp,
      });

      console.log('otp' , response )

      const { refresh_token , access_token , user_type  } = response.data.user;

      localStorage.setItem('current_user_type' , user_type)
      localStorage.setItem(`${user_type}_token` , access_token)
      localStorage.setItem(`${user_type}_token_refresh` , refresh_token)
      setMessage(response.data.message);
      dispatch(setUser_id(response.data.user.id));
      dispatch(setUsername(response.data.user.username));
      dispatch(setEmail(response.data.user.email));
      toastr.success(response.data.message);
      closeModal();
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.error || "OTP verification failed";
      setErrors({ otp: errorMessage });
    }

    setSubmitting(false);
  };

  return (
    <div>
      <h2 className="flex justify-center mt-[4%] text-xl font-semibold mb-4">Verify OTP</h2>
        {/* <div className='flex bg-black justify-center ml-10' >

          <CountDownTimer onExpiresAT={twoMinutesLater} onExpire={handleOtpSubmit} />
        </div> */}

      <Formik
        initialValues={{ otp: '' }}
        validate={(values) => {
          const errors = {};
          if (!/^\d{6}$/.test(values.otp)) {
            errors.otp = 'Invalid Otp Format';
          }
          if (!values.otp || values.otp.length !== 6) {
            errors.otp = 'OTP must be exactly 6 digits';
          }

          return errors;
        }}
        onSubmit={handleOtpSubmit}
      >
        {({ values, setFieldValue, errors, isSubmitting }) => (
          <div className="flex justify-center">

          <Form className="space-y-4">
            <InputOTP
              maxLength={6}
              value={values.otp}
              onChange={(val) => setFieldValue('otp', val)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            {errors.otp && (
              <div className="text-red-600 text-sm text-center">{errors.otp}</div>
            )}

            <button
              type="submit"
              className="flex mx-auto mt-4 py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verifying...' : 'Verify OTP'}
            </button>
          </Form>
        </div>
        )}
      </Formik>
    </div>
  );
}

export default OtpVerificationForm;
