import React ,{useEffect, useState} from 'react'
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Sidebar from '../../../components/admin/Sidebar';
import Navbar from '../../../components/admin/Navbar';
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';
import TheatreApi from '@/axios/theatreapi';


function EditTheatre( ) {
    const navigate = useNavigate();
    const {id} = useParams()
    const [initialValues, setInitialValues ] = useState([])
    const [ cityId , setCityId ] = useState(0);

    useEffect(() => {
        fetchTheatres()
    },[id]);

   
    const fetchTheatres = async() => {

        try {

            const res = await TheatreApi.get(`/theatre/${id}/edit/`);
            setCityId(res.data[0].cityid)
            setInitialValues({
                name : res.data[0].name,
                details : res.data[0].address,
            });

        }catch(e) {

            console.log('feching theatre Error',e)
        }
    }



    const validationSchema = Yup.object({
        name : Yup.string().required('* name must be required') ,
        details : Yup.string().required('* details is required')
    })
    const handleSubmit = async (values) => {
        const formData = new FormData

        formData.append('name' , values.name)
        formData.append('address' , values.details)

        try {
            const res = await TheatreApi.put(`/theatre/${id}/edit/`, 
                formData )
            navigate(`/theatre-owner/list-theatre`)
        }catch(e){
            console.log('error Theatre editing onsubmit',e.response )
            alert('edit incomplete')
        }
    }

  return (

    <div className="flex min-h-screen bg-gray-100">
        
            <div className="p-8 py-10">
                <h2 className="text-center mb-7 pt-12 px-3 font-semibold text-3xl text-gray-500">
                    Edit Theatre
                </h2>
                <Formik
                    initialValues={initialValues || {name : "" , details : ""}}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ setFieldValue  }) => (
                        <Form className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg space-y-6">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    name 
                                </label>

                                <Field
                                    type="text"
                                    name="name"
                                    className="mt-3 w-full border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300"
                                />
                                <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />

                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Detail 
                                </label>

                                <Field
                                    type="text"
                                    name="details"
                                    className="mt-3 w-full border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300"
                                />
                                <ErrorMessage
                                    name="details"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />

                            </div>

                            <button
                                type="submit"
                                className="flex mx-auto mt-3 bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Submit
                            </button>

                        </Form>
                    )}
                </Formik>
            </div>
        </div>
      
  )
}

export default EditTheatre
