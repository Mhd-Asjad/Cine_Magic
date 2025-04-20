import React, { useEffect , useState } from 'react'
import seatsApi from '@/Axios/seatsaApi'
import {
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
} from "@/components/ui/card";
import Modal from '@/Components/Modals/Modal';
import AddLayout from './AddLayout';
import { TbLayoutGridAdd } from "react-icons/tb";


function ShowSeats() {
    const [ layouts , setLayouts ] = useState([]);
    const [ isModalOpen , setIsModalOpen ] = useState(false);
    useEffect(() => {
        const fetchLayouts = async() => {
            try{
                const res = await seatsApi.get('seats-layout/')
                setLayouts(res.data)
            }catch(e) {
                console.log(e)
            }
        }
        fetchLayouts()
    },[])
    console.log(layouts)

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

  return (
    <div className='p-8' >
        <Card className="w-full py-2 max-w-4xl" > 
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-500" >layout</CardTitle>
                <div className='flex justify-end' >

                    <button className='flex bg-green-300 px-1 py-2 rounded-sm'
                        onClick={openModal}
                    > 
                        <TbLayoutGridAdd size={25} /> add Layout
                    </button>
                </div>
            </CardHeader>
            <CardContent>
            <div className="w-full overflow-x-auto">
                <table className='w-full border-collapse' >

                    <thead >

                        <th className='p-3' >no</th>
                        <th className='p-3' >layout Name</th>
                        <th className='p-3' >Total Seats</th>
                        <th className='p-3'>Total rows</th>
                    </thead >
                    <tbody >

                        {layouts.length > 0 ?
                            layouts.map((layout) => (
                                <tr key={layout.id} className='"border-b hover:bg-gray-50' >
                                    <td className='p-3' >{layout.id}</td>
                                    <td className='p-3 font-bold' >{layout.name}</td>
                                    <td className='p-10' >{layout.total_capacity}</td>
                                    <td className='p-7' > {layout.rows}</td>
                                   
                                </tr>
                            )
                        ):(
                            <p> No layout found</p>
                        )}
                    </tbody>
                </table>

            </div>
            </CardContent>
        </Card>
        <Modal isOpen={isModalOpen} closeModal={closeModal} >
            <AddLayout closeModal={closeModal} />
        </Modal>
      
    </div>
  )
}

export default ShowSeats
