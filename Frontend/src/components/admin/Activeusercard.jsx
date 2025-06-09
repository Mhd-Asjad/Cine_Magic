import React from 'react'
import { IoPersonCircle } from "react-icons/io5";

function Activeusercard({ activeUsersCount }) {
  return (
    <div className='flex bg-white p-6 rounded-lg shadow-lg border border-gray-200' >

        <h2 className='text-xl font-semibold py-2 text-green-700' >Active Users</h2>
        <div className='text-5xl' >
            <IoPersonCircle/>
    <p className='text-3xl font-bold text-purple-600 mt-2' >{activeUsersCount}</p>  
        </div>
    </div>
  )
}

export default Activeusercard
