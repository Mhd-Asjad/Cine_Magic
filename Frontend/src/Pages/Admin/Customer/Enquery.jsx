import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Sidebar from '../../../Components/Admin/Sidebar'
import Navbar from '../../../Components/Admin/Navbar'
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import toastr from 'toastr';
import TheatreApi from '../../../Axios/theatreapi';

function Enquery() {

    const [ enquery , setEnquery ] = useState([])
    const [ isLoading , setIsLoading ] = useState(true);
    
    useEffect(()=> {
        unauthrizedTheatres()
        setIsLoading(false)
    },[isLoading])

    const unauthrizedTheatres = async () => {
        try {

            const res = await TheatreApi.get('theatreowners/')
            setEnquery(res.data.enquery)

        }catch(e) {
            console.log(e.response?.message || 'error occurss')
        }
    }
    console.log(enquery)
    const handleAccept = async (ownerProfile_id , user_id) => {
        setIsLoading(true)
        try {
            
            const res = await TheatreApi.post('theatreowners/', {
                'id' :  ownerProfile_id ,
                'ownership_status' : 'confirmed',
                'userId' : user_id
            })
            console.log(res.data.message)
        }catch(e){
            console.log(e.response?.error || 'unexpected error occurs ')
        }

    }

    const handleDecline = async (userId) => {
        
        setIsLoading(true)
        try {
            const res = await TheatreApi.post('theatreowners/', {
                'id' :  userId ,
                'ownership_status' : 'rejected'
            })
            console.log(res.data.message)
        }catch(e){
            console.log(e.response?.error || 'unexpected error occurs ')
        }
    }
    console.log(enquery)
  return (
    
    <div className='flex min-h-screen bg-gray-100' >
            
            <div className='p-3 mt-7' >
                <h2 className='flex justify-center mt-8 font-semibold text-2xl' >Theatre Owners</h2>

            {isLoading ? (
                <div className="flex justify-center items-center text-xl font-bold text-blue-600">
                    Loading...  
                </div>
            ) : enquery.length === 0 ? (
                <div className="flex justify-center text-gray-500 mt-5">No Enquiries Found</div>
            ) : (
                enquery.map((value) => (
                    <div key={value.id} style={{ display: "inline-grid", margin: "10%", width : '250px' }}>
                        <Card sx={{ maxWidth: 600 }}>
                            <CardContent>
                                <Typography variant="h4" component="div">
                                    <span className="text-gray-400">{value.theatre_name}</span>
                                </Typography>
                                <Typography variant="body1">
                                    <p className="font-bold text-1xl">More details:</p>
                                    <div className='flex justify-center ' >

                                    <img src={value.owner_photo} alt="owner_pic" className='w-full h-[40%] ' />

                                    </div>
                                    <br />

                                    <span className="text-gray-500 font-semibold">Location</span>: {value.location}
                                    <br />
                                    <span className="text-gray-500 font-semibold">State</span>: {value.state}
                                    <br />
                                    <span className="text-gray-500 font-semibold">Zipcode</span>: {value.pincode}
                                </Typography>
                                <Typography>{value.message}</Typography>
                            </CardContent>
                            <div className="py-3 px-5 flex gap-2 justify-end">
                                <Button variant="contained" color="success" onClick={() => handleAccept(value.id , value.user_id)}>
                                    Accept
                                </Button>
                                <Button variant="outlined" color="error" onClick={() => handleDecline(value.id)}>
                                    Decline
                                </Button>
                            </div>
                        </Card>
                    </div>
                ))
            )}
            </div>
        </div>
  )
}

export default Enquery
