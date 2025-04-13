import React, { useEffect , useState } from 'react'
import seatsApi from '@/Axios/seatsapi'
import {
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
} from "@/components/ui/card";


function ShowSeats() {
    const [ layouts , setLayouts ] = useState([]);
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

  return (
    <div className='p-8' >
        <Card className="w-full py-2 max-w-4xl" > 
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-500" >layout</CardTitle>
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
                            <p></p>
                        )}

                    </tbody>
                </table>

            </div>
            </CardContent>
        </Card>
      
    </div>
  )
}

export default ShowSeats
