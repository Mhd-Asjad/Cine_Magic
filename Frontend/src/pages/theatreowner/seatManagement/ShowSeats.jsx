import React, { useEffect , useState } from 'react'
import seatsApi from '@/axios/seatsaApi'
import {
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
} from "@/components/ui/card";
import Modal from '@/components/modals/Modal';
import AddLayout from './AddLayout';
import { TbLayoutGridAdd } from "react-icons/tb";
import EditLayout from './EditLayout';


function ShowSeats() {

    const [ layouts , setLayouts ] = useState([]);
    const [ selectedLayout , setSelectedLayout ] = useState(null)
    const [ isModalOpen , setIsModalOpen ] = useState(false);
    const [isEditModalOpen , setIsEditModalOpen] = useState(false);
    useEffect(() => {
        fetchLayouts()
    },[])
    const fetchLayouts = async() => {
        try{
            const res = await seatsApi.get('seats-layout/')
            setLayouts(res.data)
        }catch(e) {
            console.log(e)
        }
    }

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const openEditModal = (layout) => {
        setSelectedLayout(layout)
        setIsEditModalOpen(true)
    }
    const closeEditModal = (updated = false) => {
        setSelectedLayout(null);
        setIsEditModalOpen(false)
        if (updated) fetchLayouts();
    }

  return (
    <div className='p-8'>
    <Card className="w-full py-2 max-w-4xl">
        <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-500">Layout</CardTitle>
        <div className='flex justify-end'>
            <button
            className='flex items-center gap-1 bg-green-300 px-3 py-2 rounded-sm'
            onClick={openModal}
            >
            <TbLayoutGridAdd size={20} /> Add Layout
            </button>
        </div>
        </CardHeader>

        <CardContent>
        <div className="w-full overflow-x-auto">
            <table className='w-full border-collapse text-left'>
            <thead className="bg-gray-100">
                <tr>
                <th className='p-3 min-w-[50px]'>No</th>
                <th className='p-3 min-w-[150px]'>Layout Name</th>
                <th className='p-3 min-w-[120px]'>Total Seats</th>
                <th className='p-3 min-w-[100px]'>Total Rows</th>
                <th className='p-3 min-w-[100px]'>Action</th>
                </tr>
            </thead>

            <tbody>
                {layouts.length > 0 ? (
                layouts.map((layout, index) => (
                    <tr key={layout.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-bold">{layout.name}</td>
                    <td className="p-3">{layout.total_capacity}</td>
                    <td className="p-3">{layout.rows}</td>
                    <td className="p-3">
                        <button
                        className="px-3 py-1 outline outline-1 outline-black rounded text-sm hover:bg-gray-100"
                        onClick={() => openEditModal(layout)}
                        >
                        Edit
                        </button>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="5" className="p-3 text-center text-gray-500">
                    No layout found
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
        </CardContent>
    </Card>

    <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <AddLayout closeModal={closeModal} fetchLayouts={fetchLayouts} />
    </Modal>

    <Modal isOpen={isEditModalOpen} closeModal={() => closeEditModal(false)}>
        <EditLayout closeModal={closeEditModal} selectedLayout={selectedLayout} />
    </Modal>
    </div>

  )
}

export default ShowSeats
