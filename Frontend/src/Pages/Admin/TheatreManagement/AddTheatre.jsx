import axios from 'axios';
import React , {useEffect, useState} from 'react'
import 'toastr/build/toastr.min.css';
import toastr from 'toastr';


function AddTheatre({ city , city_id }) {
    const [theatreName , setTheatreName] = useState('');
    const [ address , setAddress ] = useState('');
    toastr.options = {
        positionClass : 'toast-left-center',
        hideDuration : 3000,
        timeOut : 3000,
        closeButton : true
    }
    useEffect(() => {
        toastr.info('toastr called successfully')
    },[])
    
    const handleButton = () => {
        toastr.error('nna pudcho free error')
    }
    const handleAddTheatre = async (e) => {
        if (!theatreName || !address) {
            toastr.warning('name and address is requiredd')
            return;
        }

        const theatreData = {
            'name' : theatreName,
            'address' : address,
        }
        try {
            const res = await axios.post(`http://127.0.0.1:8000/adminside/theatre/${city_id}/add`,theatreData)
            toastr.success('theatre addedd successfully')
            setTheatreName('')
            setAddress('')
        }catch(e){
            
            console.log('error creating theatre' , e.response?.data)
        }
    }
  return (
    <div >
        
    <h2 className='flex justify-center p-2 font-semibold text-xl' >Add Theatre in {city}</h2>
        <div className='flex flex-col space-y-2'>
            <form onSubmit={handleAddTheatre} >

            <input 
            type="text"
            placeholder='Add Theatre name'
            onChange={(e) => setTheatreName(e.target.value) }
            className="mt-1 mb-7 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"

            />
            
            <input 
            type="text"
            placeholder='Add valid address'
            onChange={(e) => setAddress(e.target.value) }
            className="mt-1 mb-6 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"

            />

            <button
            type='submit'
             className='flex mt-4 mx-auto justify-center items-center w-[25%] py-1 px-2 bg-blue-500 text-white font-bold rounded-md' >
              Save
            </button>
            </form>
        </div>
      
    </div>
  )
}

export default AddTheatre
