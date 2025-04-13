import React, { useEffect, useState } from 'react'
import apiAdmin from '@/Axios/api'
import {
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from "@/components/ui/card";
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { 
    Dialog,     
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";
import { Check, X , Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast"
import Swal from 'sweetalert2';

  
function ShowRequest() {
    const [ theatreData , setTheatreData ] = useState([])
    const {toast} = useToast()
    console.log(theatreData)
    useEffect(()=> {
        handleTheatresRequest()
    },[])
    const handleTheatresRequest = async () => {
        try{
            const res = await apiAdmin.get('theatre_owners/');
            setTheatreData(res.data)

        }catch(e){
            console.log(e.response)
        }
    }
    console.log(theatreData)

    const getStatusVariant = (status) => {
        if (status) {
            return 'secondary'

        }else if(!status) {
            return 'default' 

        }else {
            return 'destructive';
        }

    }

    const handleApprove = async (theatre_id) => {
        const status = 'confirmed'
        try {
            const res = await apiAdmin.post(`theatre_owners/`, {
                "action" : status,
                'theatre_id' : theatre_id
            } );
            console.log(res.data.message)

            toast({
                description : "Theatre approved successfully..!"
            })

            handleTheatresRequest()

        }catch(e){
            toast({
                description: "Failed to approve theatre.",
                variant: "destructive",
            });
            console.log(e.response)
        }
    }
    const handleReject = async(theatre_id) => {

        console.log(theatre_id)
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });
        if (result.isConfirmed){

            try {
                const res = await apiAdmin.delete(`theatre/${theatre_id}/delete`)
                toast({
                    description: "Theatre request rejected and removed!",
                    variant: "success"
                });
                handleTheatresRequest()
            }catch(e){
                toast({
                    description: "Failed to reject theatre.",
                    variant: "destructive",
                });
                console.log(e.response);
            }
        }
    }

  return (
    <div className='p-10 mt-10' >

    
    <Card className='w-full py-10 max-w-4xl mx-auto'>
        <CardHeader >
            <CardTitle className="flex justify-center text-xl font-semibold text-gray-500" >Theatre Owner Register Request</CardTitle>
                <CardDescription>Card Description</CardDescription>
                <CardContent>
                    <div className="w-full overflow-x-auto">
                        <table className='w-full border-collapse' >
                            <thead >
                                <th className="p-3 text-left">Owner</th>
                                <th className="p-3 text-left">Theatre Name</th>
                                <th className="p-3 text-left">Location</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Actions</th>                                            
                            </thead>

                            <tbody>

                                {theatreData.map((data) => (
                                    <tr key={data.id} className="border-b hover:bg-gray-50" >

                                        <td className='p-3'>{data.owner.user_name}</td>
                                        <td className='p-3'>{data.name}</td>
                                        <td className='p-3' >{`${data.city.name}`}</td>
                                        <td>

                                        < Badge variant={getStatusVariant(data.is_confirmed)} >
                                            {data.is_confirmed ? 'accepted' : 'pending'}
                                        </Badge>

                                        </td>

                                        <td className='p-3' >
                                            <div className='flex space-x-2' >
                                                <Dialog>

                                                    <DialogTrigger asChild >
                                                        <Button variant="outline" size="icon" >
                                                            <Eye className='h-4 w-2' />
                                                        </Button>
                                                        
                                                    </DialogTrigger>
                                                    < DialogContent className="max-w-2xl" >
                                                        <DialogHeader >
                                                            <DialogTitle className="flex justify-content-center" >
                                                                Theatre Details for {data.name}
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                        <div className='grid grid-cols-1 gap-2'>
                                                            <h3 className='font-semibold mb-2' >Owner Information</h3>
                                                            <p> Username : {data.owner.user_name}</p>
                                                            <p> Location : {data.owner.location} </p>
                                                            <p> pincode: {data.owner.pincode} </p>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold mb-2">Theatre Info</h3>
                                                            <div className="mb-2 p-2 border rounded">
                                                                <p><strong>Name:</strong> {data.name}</p>
                                                                <p><strong>City:</strong> {`${data.city.name}`}</p>
                                                                <p><strong>Address:</strong> {data.address}</p>

                                                                <h4 className="font-medium mt-2">Screens:</h4>

                                                                {data.screens.length > 0 ? (
                                                                    data.screens.map((screen) => (
                                                                        <div key={screen.id} className="text-sm pl-2 border rounded p-2 my-2">
                                                                            <p><strong>Screen {screen.screen_number} - {screen.screen_type || "N/A"}</strong></p>
                                                                            <p>Capacity: {screen.capacity}</p>

                                                                            <h5 className="font-medium mt-2">Showtimes:</h5>
                                                                            {screen.showtimes.length > 0 ? (
                                                                                <ul className="list-disc pl-4">
                                                                                    {screen.showtimes.map((show) => (
                                                                                        <li key={show.id}>
                                                                                            {show.movie} | {show.start_time} - {show.end_time}
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            ) : (
                                                                                <p className="text-gray-500">No showtimes available</p>
                                                                            )}
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p className="text-red-500">No screens available</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                            {!data.is_confirmed && (

                                                <>
                                                
                                                <Button 
                                                    variant='outline'
                                                    size='icon'
                                                    onClick={() => handleApprove(data.id)}
                                                >
                                                    <Check className='h-4 w-4 text-green-500' />

                                                </Button>
                                                <Button 
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleReject(data.id)}
                                                >
                                                    <X className='h4 w-4 text-red-500' />
                                                </Button>
                                                </>

                                            )}
                                            </div>        
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </CardContent>
        </CardHeader>
    </Card>
    </div>
  )
}
export default ShowRequest