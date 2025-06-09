import seatsApi from '@/axios/seatsaApi';
import { useToast } from '@/hooks/use-toast';
import React ,{useEffect, useState} from 'react'

function EditLayout( { closeModal , selectedLayout } ) {
    console.log(selectedLayout)
    const [name , setName] = useState('');
    const [ cols , setCols] = useState('');
    const [ rows , setRows ] = useState('');
    const {toast} = useToast();

    useEffect(() => {

        const setData = () =>  {
            const { name , rows , cols} = selectedLayout    
            setName(name)
            setCols(cols)
            setRows(rows)
        }
        setData() 
        console.log('data changed')
    },[])

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const res = await seatsApi.patch(`edit-layout/${selectedLayout.id}/` , {
                'name' : name,
                'rows' : rows,
                'cols' : cols
            })
            if (res.status === 200){
                toast({title : 'data update successfully'})
                closeModal(true)
            }
        }catch(e){
            console.log(e ,'error')
        }
    }


  return (
    <div>
        <div className='flex justify-center mb-5 font-semibold'>
            <h2>Edit {selectedLayout.name}</h2>
        </div>

        <form onSubmit={handleSubmit}>
            <label className='flex pl-[15%]'>
                Layout name
            </label>
            <div className='flex justify-center' >

            <input 
                type="text" 
                className='mt-3 w-[70%] border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300'
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            </div>

            <div className='grid grid-flow-col grid-rows-2 gap-6 justify-center' >
            <label className='mt-6'>    
                number of rows
            </label>
            <input 
                type="number" 
                value={rows}
                className='w-[70%] border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300'
                onChange={(e) => setRows(e.target.value)}
            />
    
                <label className='mt-6 '>

                    number of seat in a row
                </label>

            <input 
                type="number" 
                value={cols}
                className='w-[70%] border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300'
                onChange={(e) => setCols(e.target.value)}
            />
            </div>
            <div className="flex justify-center pt-8 pr-7 " >

                <button className='bg-black text-white py-2 px-2 rounded-md' >
                Edit Layout 
                </button>
            </div>

        </form>
      
    </div>
  )
}

export default EditLayout
