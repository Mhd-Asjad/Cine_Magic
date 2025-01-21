import React, { useState } from 'react'
import { Formik, Form, ErrorMessage, Field } from 'formik'
import * as Yup from 'yup'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import { FilledInput, FormControl } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';
import { setEmail, setUsername } from '../../Redux/Features/UserSlice';
import { useDispatch } from 'react-redux';

function LoginForm( { isModalClose }) {
    const [showpassword , setShowPassword ] = useState(false);
    const dispatch = useDispatch();
    const handleClickShowPassword = () => setShowPassword((show) => !show)


    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    
    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };
    

    const initialValues = {
        username : '' ,
        password : '' ,

    }
    
    const validationSchema = Yup.object({


        username : Yup.string().required('* username is required'),
        password : Yup.string().required('*password is required')
    })


    const onSubmit = async (values, { setSubmitting }) => {

        try {

            const response = await axios.post('http://127.0.0.1:8000/user_api/userlogin/', values , {
                headers : {
                    "Content-Type" : "application/json"
                }
            })
            toastr.success(response.data.message)
            dispatch(setUsername(response.data.user.username))
            dispatch(setEmail(response.data.user.email))
            isModalClose()
            
        }catch(e) {
            console.log('loggin error' , e)
            toastr.error('invalid credentials')
            setSubmitting(false)
        }
    }
  return (
    <Box sx={{  display: 'flex', flexWrap: 'wrap', justifyContent : 'center' }}>

      <div>
        <h2 className="text-xl font-semibold mb-4">Login</h2>
    <Formik
    
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
    >

        {({ isSubmitting }) => (
        <Form className="space-y-4">
                <div>
                    <Field
                        as={TextField}
                        label='username'
                        name="username"
                        id="username"
                        sx={{ m: 1, width: '45ch' }}
        
                    />
                    <ErrorMessage
                        name="username"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                    />
                </div>
            <div>

            <FormControl sx={{ m: 1, width: '45ch' }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <Field
                as={FilledInput}
                id="outlined-adornment-password"
                name="password"
                type={ showpassword ? 'text' : 'password' }
                endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showpassword ? 'hide the password' : 'display the password'
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"

                      >
                        {showpassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
            
            />
            </FormControl>
            <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
            />
            </div>
            <button
                type="submit"
                className="flex mx-auto w-[35%] py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
        </Form>
        )}

        </Formik>
        </div>
    </Box>
  )
}

export default LoginForm