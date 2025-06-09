import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Sidebar from '../../../components/admin/Sidebar';
import Navbar from '../../../components/admin/Navbar';
import axios from 'axios';
import apiAdmin from '../../../axios/api';
import { FormatIndentDecreaseSharp } from '@mui/icons-material';
import { useToast } from '@/hooks/use-toast';

function AddMovies() {
    
    const [loading, setLoading] = useState(false);
    const {toast} = useToast()
    const initialValues = {
        title: '',
        language: '',
        duration: '',
        release_date: '',
        description: '',
        genre: '',
        poster: null,
    };
    const validationSchema = Yup.object({
        title : Yup.string().required('* Field is required'),
        language: Yup.string().required('* Language is required'),
        duration: Yup.number()
            .required('* Duration is required')
            .positive('* Duration must be a positive number')
            .integer('* Duration must be a whole number'),
        release_date: Yup.date().required('Release date is required'),
        description: Yup.string()
            .required('Description is required')
            .max(300, 'Description must be 300 characters or less'),
        genre: Yup.string().required('Genre is required'),
        poster: Yup.mixed()
            .required('Poster is required')
            .test('fileType', 'Only image files are allowed', (value) => {
                return value ? ['image/jpeg', 'image/png', 'image/jpg' , 'image/webp'].includes(value.type) : true ;
            }),
    });

    const handleSubmit = async (values, { resetForm }) => {
        setLoading(true)
        const formData = new FormData();
        console.log('poster' , values.poster)
        Object.keys(values).forEach((key) => {
            if (key == 'poster' && values.poster){
                formData.append('poster' , values.poster)

            }else{
                formData.append(key, values[key]);

            }
        });
        console.log(formData)
        try {
            const response = await apiAdmin.post('movies/', formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            console.log(response.data)
            toast({
                title : 'movie added successfully',
                variant : 'success'
            })
            resetForm();
        } catch (error) {
            console.error('Error adding movie:', error);
        }finally{
            setLoading(false);
        }
    };

    return (
        
        <div className="w-full max-w-screen-xl mx-auto">
        
                <div className="p-8 py-4">
                    <h2 className="text-center mb-7 pt-12 px-3 font-semibold text-3xl text-gray-500">
                        Add Movies
                    </h2>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        >
                        {({ setFieldValue  }) => (
                            <Form className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg space-y-6">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Movie Title
                                    </label>
                                    <Field
                                        type="text"
                                        name="title"
                                        className="w-full border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300"
                                    />
                                    <ErrorMessage
                                        name="title"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mt-2">
                                        Language
                                    </label>
                                    <Field
                                        type="text"
                                        name="language"
                                        className="mt-3 w-full border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300"
                                    />
                                    <ErrorMessage
                                        name="language"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mt-2">
                                        Duration (in mins)
                                    </label>
                                    <Field
                                        type="number"
                                        name="duration"
                                        className="mt-3 w-full border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300"
                                    />
                                    <ErrorMessage
                                        name="duration"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mt-2">
                                        Release Date
                                    </label>
                                    <Field
                                        type="date"
                                        name="release_date"
                                        className="mt-3 w-full border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300"
                                    />
                                    <ErrorMessage
                                        name="release_date"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mt-2">
                                        Description
                                    </label>
                                    <Field
                                        as="textarea"
                                        name="description"
                                        className="mt-3 w-full border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300"
                                    />
                                    <ErrorMessage
                                        name="description"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mt-2">
                                        Genre
                                    </label>
                                    <Field
                                        type="text"
                                        name="genre"
                                        className="mt-3 w-full border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300"
                                    />
                                    <ErrorMessage
                                        name="genre"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mt-2">
                                        Poster
                                    </label>
                                    <input
                                        type="file"
                                        name="poster"
                                        accept='image/'
                                        onChange={(event) => {
                                            setFieldValue('poster', event.currentTarget.files[0]) || null ;
                                        }}
                                        className="mt-3 w-full border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300"
                                    />
                                    <ErrorMessage
                                        name="poster"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="flex mx-auto mt-3 hover:bg-blue-600 bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Submit
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
    );
}

export default AddMovies;
