import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import apiAdmin from '../../../Axios/api';

function EditMovie() {
    const { movie_id } = useParams(); 
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState(null);
    const navigate = useNavigate()
    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await apiAdmin.get(`movies/${movie_id}/update/`);
                console.log(res.data)
                setInitialValues(res.data);
            } catch (error) {
                console.error('Error fetching movie:', error);
            }
        };
        fetchMovie();
    }, [movie_id]);

    const validationSchema = Yup.object({
        title: Yup.string().required('* Field is required'),
        language: Yup.string().required('* Language is required'),
        duration: Yup.number()
            .required('* Duration is required')
            .positive('* Must be a positive number')
            .integer('* Must be a whole number'),
        release_date: Yup.date().required('* Release date is required'),
        description: Yup.string()
            .required('* Description is required')
            .max(300, 'Description must be 300 characters or less'),
        genre: Yup.string().required('* Genre is required'),
        poster: Yup.mixed().nullable()
        .required('photo field is required')
    });

    const handleSubmit = async (values) => {
        setLoading(true);
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            if (key === 'poster' && values.poster) {
                formData.append('poster', values.poster);
            } else {
                formData.append(key, values[key]);
            }
        });

        try {
            const response = await apiAdmin.put(`movies/${movie_id}/update/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Movie updated successfully');
            navigate('/admin/movies')
        } catch (error) {
            console.error('Error updating movie:', error);
        } finally {
            setLoading(false);
        }
    };
    console.log(initialValues)
    if (!initialValues) return <p>Loading movie data...</p>;

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="p-8 py-4">
                <h2 className="text-center mb-7 pt-12 px-3 font-semibold text-3xl text-gray-500">
                    Edit Movie
                </h2>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ setFieldValue }) => (
                        <Form className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg space-y-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Movie Title</label>
                                <Field type="text" name="title" className="w-full border-gray-300 border rounded-lg px-4 py-2" />
                                <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mt-2">Language</label>
                                <Field type="text" name="language" className="w-full border-gray-300 border rounded-lg px-4 py-2" />
                                <ErrorMessage name="language" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mt-2">Duration (in mins)</label>
                                <Field type="number" name="duration" className="w-full border-gray-300 border rounded-lg px-4 py-2" />
                                <ErrorMessage name="duration" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mt-2">Release Date</label>
                                <Field type="date" name="release_date" className="w-full border-gray-300 border rounded-lg px-4 py-2" />
                                <ErrorMessage name="release_date" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mt-2">Description</label>
                                <Field as="textarea" name="description" className="w-full border-gray-300 border rounded-lg px-4 py-2" />
                                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mt-2">Genre</label>
                                <Field type="text" name="genre" className="w-full border-gray-300 border rounded-lg px-4 py-2" />
                                <ErrorMessage name="genre" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mt-2">Poster</label>
                                {initialValues?.poster && typeof(initialValues.poster) === 'string' && (
                                    <img src={initialValues.poster} alt="Current Poster" className="h-32 w-32 object-cover mb-2 rounded-md" />
                                )}
                                <input
                                    type="file"
                                    name="poster"
                                    accept="image/*"
                                    onChange={(event) => {
                                        const file = event.currentTarget.files[0];
                                        setFieldValue('poster', file || null)
                                    }}
                                    className="w-full border-gray-300 border rounded-lg px-4 py-2"
                                />
                                <ErrorMessage name="poster" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <button type="submit" className="flex mx-auto mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                {loading ? 'Updating...' : 'Update Movie'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}

export default EditMovie;
