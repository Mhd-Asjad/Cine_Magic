import React , {useEffect, useState} from 'react'
import axios from 'axios'
import Sidebar from '../../../Components/Admin/Sidebar'
import Navbar from '../../../Components/Admin/Navbar'
import { IoIosAddCircleOutline } from "react-icons/io";
import Modal from '../../../Components/Modals/Modal';
import Addcity from './Addcity';
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
function ListCity() {

    const [ cities , setCitiesData ] = useState([])
    const [ addCityModalOpen , isAddCityModal ] = useState(false);
    const navigate = useNavigate()

    useEffect(()=> {
        fetchCities()
    },[])

    const fetchCities = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/movies/list_cities/');
            setCitiesData(response.data.cities)
            console.log(response.data.cities)
            
        }catch (e){
            console.log('Error while fetching cities ',e)
        }
    }
    
    const deleteCity = async (cityId) => {
      try {
        const res = await axios.delete(`http://127.0.0.1:8000/adminside/city/${cityId}/delete`)
        setCitiesData(res.data.remaining_cities)

      }catch(e) {
        console.log('error found deleting city' , e)
      }
    }

    const handleShowTheatre = (cityId) => {
        navigate(`/cities/${cityId}/theatres`)

    }

  return (
    <div className='flex min-h-screen bg-gray-100' >
    <div className="w-64 bg-gray-800 text-white">
      <Sidebar />
    </div>

  <div className='flex-1'>
    <Navbar/>

    <div className='p-4 py-20 ' >
      <h1 className='text-2xl font-bold mb-5 flex justify-center z-10' >City Management</h1>
      <div className='overflow-x-auto' >

        <div className='flex mb-2 justify-end p-3' >

      <button className='flex mb-2 justify-end items-center gap-1 border rounded-md py-1 px-3 border-green-300 font-semibold'
        onClick={() => isAddCityModal(true)}
        >
        <IoIosAddCircleOutline className='text-2xl' />
            add 
        </button>

        </div>

        
        <table className='table-auto w-full border-collapse border border-gray-300' >

          <thead>

            <tr className='bh-gray-200' >

              <th className='border border-gray-300 px-4 py-2 bg-blue-200'  >Name</th>
              <th className='border border-gray-300 px-4 py-2 bg-blue-200'  >state</th>
              <th className='border border-gray-300 px-4 py-2 bg-blue-200'  >pincode</th>
              <th className='border border-gray-300 px-4 py-2 bg-blue-200'  >Action</th>
              
            </tr>

          </thead>
          <tbody>

              {cities.map((city) => (
                <tr key={city.id} className='hover:bg-gray-100' >

                  <td className='border border-gray-300 px-4 py-2' >{city.name}</td>
                  <td className='border border-gray-300 px-4 py-2' >{city.state} </td>
                  <td className='border border-gray-300 px-4 py-2' >{city.pincode}</td>
                  <td className='border border-gray-300 px-4 py-2 w-3' >
                    <div className='flex gap-2' >

                    <button 
                    className='border rounded-md py-1 px-3 border-blue-300 font-semibold'
                    onClick={() => handleShowTheatre(city.id)}
                    >
                    show theatres
                    </button>
        
                    <button className='flex items-center gap-1 border rounded-md py-1 px-3 border-red-700 font-semibold'
                    onClick={() => deleteCity(city.id)}
                    >
                    <MdDelete className='text-2xl' />
                        delete
                    </button>
                    </div>
                    
                  </td>

                </tr>
              ))
              }

          </tbody>


        </table>
      </div>

      <Modal isOpen={addCityModalOpen} closeModal={() => isAddCityModal(false)} >

            <Addcity/>

      </Modal>
    </div>
  </div>

  </div>
  )
}

export default ListCity
