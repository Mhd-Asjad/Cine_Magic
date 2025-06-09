import React, { useState } from 'react'
import axios from 'axios'
function Addcity() {
    const [ city , setCity ] = useState('');
    const [ state , setState ] = useState('');
    const [ pincode , setPincode ] = useState('');
    const [error , setError ] = useState('');

    const handleAddCity = async() => {

        try {
          await axios.post('http://127.0.0.1:8000/adminside/create_city/',{
            "name":city ,
            "state" : state,
            "pincode" :pincode
          })

        }catch(e){  
          console.log('Error while adding city',e)
            
        }
    }

  return (
    <div >
        
    <h2 className='flex justify-center p-2 font-semibold text-xl' >Addd city</h2>
        <div className='flex flex-col space-y-2'>
            <form onSubmit={handleAddCity} >

            <input 
            type="text"
            placeholder='Add city name'
            onChange={(e) => setCity(e.target.value) }
            className="mt-1 mb-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"

            />
            
            <input 
            type="text"
            placeholder='Add state name'
            onChange={(e) => setState(e.target.value) }
            className="mt-1 mb-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"

            />

            <input

            type="number" 
            placeholder='Pincode'
            onChange={(e) => setPincode(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"

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

export default Addcity
