import React , {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../../../Components/Admin/Navbar';
import Sidebar from '../../../Components/Admin/Sidebar';
import Modal from '../../../Components/Modals/Modal'
import AddTheatre from './AddTheatre';
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert2'
function CityTheatre() {

   const {cityId} = useParams()
   const navigate = useNavigate();
   const [ theatres , setTheatres ] = useState([]);
   const [ loading , setLoading ] = useState(false);
   const [ cityName , setCityName ] = useState('');
   const [ isAddTheaterModal , setAddTheatreModal ] = useState(false);

   useEffect(() => {
    fetchCityTheatre()
   },[cityId , ])

   const fetchCityTheatre = async ( ) => {

    try {
        const response = await axios.get(`http://127.0.0.1:8000/adminside/cities/${cityId}/theatres`)
        setTheatres(response.data.theatres)
        console.log(response.data.cityname)
        setCityName(response.data.cityname)
        setLoading(flase)

    }catch(e) {
        console.log( e.response?.data?.detail || 'an error occurs')
        setLoading(false)
    }
    
    }

    const handleTheatreEdit = (theatreId) => {
        navigate(`/theatres/${theatreId}/edit`); 
    }

    const handleDeleteTheatre = async (theatreId) => {    
        const result = await swal.fire({
            title : 'Are You sure ?',
            text : 'Do you want to delete this theatre? This action cannot be undone!',
            icon : 'warning' , 
            showCancelButton : true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        })

        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`http://localhost:8000/adminside/theatre/${theatreId}/delete`);
                swal.fire('Deleated!' , 'The theatre has been deleated','success')
            }catch(e){
                console.log('action Delete' , e)
            }
        }
    }
    if (loading) return <p>Loading Theatres</p>
  return (
    <div className='flex min-h-screen bg-gray-100' >
    <div className="w-64 bg-gray-800 text-white">
      <Sidebar />
    </div>

    <div className='flex-1' >
        <Navbar/>

        <div className='p-5 py-10' >

        <h2 className='pt-12 px-3 font-semibold text-blue-500'>theatres in {cityName}</h2>

            <div className='overflow-x-auto' >

                <div className='flex mb-2 justify-end p-3' >
                <button className='flex mb-2 justify-end items-center gap-1 border rounded-md py-1 px-3 border-green-300 font-semibold'
                    onClick={() => setAddTheatreModal(true)}
                    >
                    <IoIosAddCircleOutline className='text-2xl' />
                        add Theatre
                </button>
                </div>

                <table className='table-auto w-full border-collapse border border-gray-300' >

                    <thead >

                        <tr>
                        <th className='border border-gray-300 px-4 py-2 bg-blue-200'>name</th>
                        <th className='border border-gray-300 px-4 py-2 bg-blue-200'>details</th>
                        <th className='border border-gray-300 px-4 py-2 bg-blue-200'>Actions</th>

                        </tr>

                    </thead>
                    <tbody>
                        
                        {
                            theatres.length > 0 ? (
                                    
                                    theatres.map((theatre) => (
        
                                        <tr key={theatre.id} >
                                            <td className='border border-gray-300 px-4 py-2' >{theatre.name}</td>
                                            <td className='border border-gray-300 px-4 py-2' >{theatre.address}</td>
                                            <td className='border border-gray-300 px-4 py-2' >
                                            <div className='flex gap-2 justify-center' >

                                                <button className='border py-2 px-2 rounded-md border-green-500'  >
                                                    manage screen
                                                </button>


                                                <button 
                                                    className="py-2 px-2 rounded text-blue-500 text-3xl"
                                                    onClick={() => handleTheatreEdit(theatre.id)}

                                                >
                                                    <span>
                                                        <FaRegEdit/>
                                                    </span>

                                                </button>

                                                <button 
                                                    className='py-2 px-2 text-red-500 text-3xl'
                                                    onClick={() => handleDeleteTheatre(theatre.id)}
                                                >

                                                    <MdDeleteOutline/>

                                                </button>


                                            </div>



                                            </td>

        
                                        </tr>
        
                                ))

                            ):(
                                <tr>
                                <td colSpan="4" className="font-semibold border border-gray-300 px-4 py-2 text-center">
                                  No Theaters available for this city!!
                                </td>
                              </tr>
                            )
                        }


                    </tbody>
                </table>

            </div>


            <Modal isOpen={isAddTheaterModal} closeModal={() => setAddTheatreModal(false)} >


                <AddTheatre city={cityName} city_id={cityId} />


            </Modal>


        </div>

    </div>
    </div>
  )
}

export default CityTheatre
