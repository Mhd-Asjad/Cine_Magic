
import React, { useEffect, useState } from 'react'
import apiAdmin from '@/axios/api'
import {
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Dialog,     
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";
import { IoMdArrowDropdown , IoMdArrowDropup } from "react-icons/io";
import { Check, X , Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast"
import Swal from 'sweetalert2';

  
function ShowRequest() {
    const [ theatreData , setTheatreData ] = useState([])
    const {toast} = useToast();
    const [seats , setSeats]  = useState({})   
    const [showSeatLayout , setShowSeatLayout] = useState(false);
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
    
    const toggleSeatLayout = async(seats) => {
        if (!showSeatLayout){
            const organizeData = organizeByRow(seats)
            setSeats(organizeData)

        }

        setShowSeatLayout(!showSeatLayout);
    };
    const organizeByRow = (seats) => {
        const rowMap = {}
        seats.forEach((seat) => {
          if (!rowMap[seat.row]) {
            rowMap[seat.row] = []
          }
          rowMap[seat.row].push(seat)
        })
        Object.values(rowMap).forEach((rowSeats) => {
          rowSeats.sort((a, b) => a.number - b.number)
        })
        return rowMap
    }
    const getSeatClass = () => {
        return 'bg-white text-blue cursor-not-allowed outline outline-1 outline-blue-600'
    }
    const handleApprove = async (theatre_id) => {
        const status = 'confirmed'
        try {
            const res = await apiAdmin.post(`theatre_owners/`, {
                "action" : status,
                'theatre_id' : theatre_id
            });
            console.log(res.data.message)

            toast({
                description : "Theatre approved successfully..!"
            })

            handleTheatresRequest()

        }catch(error){
            console.log(error.response)
            toast({
                description: error.response?.data?.error,
                variant: "destructive",
            });
        }
    }

    const getStatusVariant = (status) => {
        if (status) {
            return 'secondary'

        }else if(!status) {
            return 'default' 

        }else {
            return 'destructive';
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
    console.log(seats)
  return (
    <div className="w-full max-w-screen-xl mx-auto">

    
    <Card className='w-full py-10 max-w-4xl mx-auto md:ml-20 sm:ml-30'>
        <CardHeader >
            <CardTitle className="flex justify-center text-xl font-semibold text-gray-500" >Theatre Screen and Ownership Request</CardTitle>
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
                        { theatreData.length > 0 ? (
                            theatreData.map((data) => (
    
                                <tr key={data.id} className="border-b hover:bg-gray-50" >

                                    <td className='p-3'>{data.owner.user_name}</td>
                                    <td className='p-3'>{data.name}</td>
                                
                                    <td className='p-3' >{`${data.city.name}`}</td>
                                    <td>
                                    < Badge variant={getStatusVariant(data.is_confirmed)} >
                                        {data.is_confirmed? 'acive' : 'pending'}
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
                                                            <p><strong>Name:</strong> {data.name} </p>
                                                            <p><strong>City:</strong> {`${data.city.name}`}</p>
                                                            <p><strong>Address:</strong> {data.address}</p>

                                                            <h4 className="font-medium mt-2 text-red-500">Unverified Screen:</h4>

                                                            {data.screens.length > 0 ? (
                                                                data.screens.map((screen) => (

                                                                    screen?.is_approved === false ? (

                                                                        <div key={screen.id} className="text-sm pl-2 mb-8 text-center rounded p-2 my-2">
                                                                            <div className="border py-3 px-2 mx-auto mb-5 w-[80%]">
                                                                                <p>
                                                                                <strong>
                                                                                    Screen {screen.screen_number} - {screen.screen_type || 'N/A'} ,
                                                                                </strong>
                                                                                </p>
                                                                                <p>Capacity: {screen.capacity}</p>

                                                                                    {data.total_screens  === 1 ?(
                                                                                    <button
                                                                                    onClick={() => toggleSeatLayout(screen.seats)}
                                                                                    className="mt-3 px-4 py-2 border border-dashed border-gray-500 rounded-md transition duration-200"
                                                                                    >
                                                                                    
                                                                                    {showSeatLayout ? 'Hide Seat Layout' : `${'Show Seat Layout'} `}
                                                                                    {showSeatLayout ? <IoMdArrowDropup size={30} className='inline' /> : <IoMdArrowDropdown size={30} className='inline' /> }
                                                                                    </button>
                                                                                ):null}
                                                                            </div>

                                                                            {showSeatLayout && (
                                                                                <div>
                                                                                <h1 className="text-lg font-semibold mb-4">Seat Layout </h1>
                                                                                <div className="mt-5">
                                                                                    <div className="flex flex-wrap gap-2">
                                                                                    {Object.entries(seats).map(([row, rowSeats]) => (
                                                                                        <div key={row} className="flex justify-center w-full mb-4">
                                                                                        <button
                                                                                            className="w-6 h-6 font-bold mr-2 rounded bg-gray-200 text-gray-700 cursor-not-allowed"
                                                                                            disabled
                                                                                        >
                                                                                            {row}
                                                                                        </button>
                                                                                        <div className="flex space-x-1">
                                                                                            {rowSeats.map((seat) =>
                                                                                            seat?.label ? (
                                                                                                <button
                                                                                                type="button"
                                                                                                key={seat.id}
                                                                                                disabled
                                                                                                title={`${seat.category_name || 'No Category'} - ₹${seat.price}`}
                                                                                                className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs ${getSeatClass(
                                                                                                    seat
                                                                                                )}`}
                                                                                                >
                                                                                                {seat.number}
                                                                                                </button>
                                                                                            ) : (
                                                                                                <div key={seat.id} className="w-6 h-6" />
                                                                                            )
                                                                                            )}
                                                                                        </div>
                                                                                        </div>
                                                                                    ))}
                                                                                    <div className="relative mb-8 pb-28 z-0">
                                                                                        <div className="flex justify-center">
                                                                                        {/* Uncomment if you want to include the screen image */}
                                                                                        {/* <img src={screenimg} className="w-[80%] mt-3" alt="screen image" /> */}
                                                                                        </div>
                                                                                    </div>
                                                                                    </div>
                                                                                </div>
                                                                                </div>
                                                                            )}
                                                                            </div>
                                                                        ) : null

                                                                ))
                                                            ) : (
                                                                <p className="">Not available</p>
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
                                ))

                            ):(

                                <div className='' >

                                    <p className="text-red-700 mx-auto">Not available</p>

                                </div>

                            )}
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