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
import { setUser_id , setEmail, setUsername } from '../../Redux/Features/UserSlice';
import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import login from './AuthService';

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
        console.log(values)
        const username = values.username;
        const password = values.password
        try {
            const res = await login( dispatch , username , password , 'user')
            isModalClose()
            
        }catch(e) {
            console.log('loggin error' , e)
            toastr.error('invalid credentials')
            setSubmitting(false)
        }
    }
  return (

    <Box sx={{  display: 'flex', flexWrap: 'wrap', justifyContent : 'center' }}>

      <div className='' >
        <h2 className="text-xl  font-semibold mb-4">Login</h2>
        <Formik
        
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >

            {({ isSubmitting }) => (
            <Form className="space-y-4">

                    <div>
                        < Field
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

                <div className="flex mx-auto w-[15%]">
                <Button 
                    variant="contained" disableElevation
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>

                </div>
            </Form>
            )}

        </Formik>
        </div>
    </Box>
  )
}

export default LoginForm