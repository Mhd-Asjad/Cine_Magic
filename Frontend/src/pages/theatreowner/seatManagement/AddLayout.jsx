import React, { useState } from 'react'
import seatsApi from '@/axios/seatsaApi';
import {toast} from 'sonner';
import { CircleCheckBig, CircleAlert } from 'lucide-react';
function AddLayout({ closeModal , fetchLayouts }) {
    const [name , setName] = useState('');
    const [ cols , setCols] = useState('');
    const [ rows , setRows ] = useState('');
    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const res = await seatsApi.post('add-layout/',{
                'name' : name , 
                'cols' : cols , 
                'rows' : rows
            })
            console.log(res.data)
            fetchLayouts()
            closeModal()
            toast('layout added successfylly',
                {
                    icon: <CircleCheckBig className="w-6 h-6 text-green-500" />,
                    style: {
                        backgroundColor: '#f0f9ff',
                        color: '#0369a1',
                    },
               }
            )

        }catch(e) {
            toast( e.response?.data?.error,{
                icon: <CircleAlert className="w-6 h-6 text-yellow-500" />,
                style: {
                    backgroundColor: '#fff3cd',
                    color: '#856404',
                },
            }
            )
        }
    }
  return (

    <div>
      <form onSubmit={handleSubmit}>
        <label className='flex pl-[15%]'>
            Layout name
        </label>
        <div className='flex justify-center' >

        <input 
            type="text" 
            className='mt-3 w-[70%] border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300'
            onChange={(e) => setName(e.target.value)}
        />
        </div>

        <div className='grid grid-flow-col grid-rows-2 gap-6 justify-center' >
        <label className='mt-3'>    
            seats in a row
        </label>
        <input 
            type="number" 
            className='w-[70%] border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300'
            onChange={(e) => setCols(e.target.value)}
        />
 
            <label className='mt-3'>

                number of Rows
            </label>

        <input 
            type="number" 
            className='w-[70%] border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300'
            onChange={(e) => setRows(e.target.value)}
        />
        </div>
        <div className="flex justify-center pt-8 pr-7 " >

            <button className='bg-black text-white py-2 px-2 rounded-md' >
            Add Layout 
            </button>
        </div>

      </form>
    </div>
  )
}

export default AddLayout