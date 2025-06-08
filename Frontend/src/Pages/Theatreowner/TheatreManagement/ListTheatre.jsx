import React , {useEffect, useState} from 'react'
import axios from 'axios'
import { IoIosAddCircleOutline } from "react-icons/io";
import Modal from '../../../components/modals/Modal';
import Addcity from '@/pages/admin/CityManagement/Addcity';
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TheatreApi from '@/axios/theatreapi';
import { CiEdit } from "react-icons/ci";
import Swal from "sweetalert2";

function ListTheatre() {

    const [ theatres , setTheatre ] = useState([])
    const navigate = useNavigate()
    const theatre_owner_id = useSelector((state) => state.theatreOwner.theatreId)
    console.log(theatre_owner_id , 'theatre owner id')
    useEffect(()=> {
        VerifiedTheatre()
        
      
    },[])
    console.log(theatres)
    const VerifiedTheatre = async () => {
        try {
          
            const response = await TheatreApi.get(`/show-available/?owner_id=${theatre_owner_id}`);
            console.log(response.data.available_theatre)
            setTheatre(response.data.available_theatre)
            
        }catch (e){
            console.log('Error while fetching cities ',e)
        }
    }
      const deleteCity = async (theatre_id) => {
        const result = await Swal.fire({
          title: "Are you sure ?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor : "#d33",
          cancelButtonColor : "#3085d6",
          confirmButtonText : "Yes, delete it!",
      });
        if (result.isConfirmed){

          try {
            const res = await TheatreApi.delete(`/theatre/${theatre_id}/delete`)
            setTheatre(res.data.remaining_cities)
  
          }catch(e) {
            console.log('error found deleting city' , e)
          }
        }
        
      }

    const handleEdit = (theatre_id) => {
      navigate(`/theatre-owner/${theatre_id}/edit-theatre`)
    }

    const handleShowScreen = (theatre_id) => {
        navigate(`/theatre-owner/${theatre_id}/screens`)

    }

  return (
    <div className='flex min-h-screen bg-gray-100' >
    <div className='p-4 py-20 ' >
      <h1 className='text-2xl font-bold mb-5 flex justify-center z-10' >Show Management</h1>
      <div className='overflow-x-auto' >
    

        
        <table className='table-auto w-full border-collapse border border-gray-300' >
          <thead>
            <tr className='bh-gray-200' >

              <th className='border border-gray-300 px-4 py-2 bg-blue-200'  >Name</th>
              <th className='border border-gray-300 px-4 py-2 bg-blue-200'  >address</th>
              <th className='border border-gray-300 px-4 py-2 bg-blue-200'  >pincode</th>
              <th className='border border-gray-300 px-4 py-2 bg-blue-200'  >Action</th>
              
            </tr>

          </thead>
          <tbody>

              { theatres.length > 0 ? (
                
                theatres.map((theatre) => (
                  <tr key={theatre.id} className='hover:bg-gray-100' >
  
                    <td className='border border-gray-300 px-4 py-2' >{theatre.theatre_name}</td>
                    <td className='border border-gray-300 px-4 py-2' >{theatre.address} </td>
                    <td className='border border-gray-300 px-4 py-2' >{theatre.pincode}</td>
                    
                    <td className='border border-gray-300 px-4 py-2 w-3' >
                      <div className='flex gap-2' >
  
                      <button 
                      className='border rounded-md py-1 px-3 border-blue-300 font-semibold'
                      onClick={() => handleShowScreen(theatre.id)}
                      >
                      show Screens
                      </button>
          
                      <button className='flex items-center gap-1 border rounded-md py-1 px-3 border-red-700 font-semibold'
                      onClick={() => deleteCity(theatre.id)}
                      >
                      <MdDelete className='text-2xl' />
                          delete
                      </button>
                      <button className='flex items-center gap-1 border rounded-md py-1 px-3 border-blue-700 font-semibold'
                      onClick={() => handleEdit(theatre.id)}
                      >
                      <CiEdit className='text-2xl' />
                          Edit
                      </button>
                      </div>
                      
                    </td>
  
                  </tr>
              ))
              ):(

                <div className="ftext-gray-500" >

                  <td className='flex jsustify-center' > No Active Theatre</td>

                </div>
              )}
          </tbody>


        </table>
      </div>

    </div>
  </div>

  )
}

export default ListTheatre