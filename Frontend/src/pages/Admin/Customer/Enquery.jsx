import React, { useEffect, useState } from 'react'
import { AlertCircle , CheckCircle } from 'lucide-react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TheatreApi from '../../../axios/theatreapi';
import { useToast } from '@/hooks/use-toast';
function Enquery() {

    const [ enquery , setEnquery ] = useState([])
    const [ isLoading , setIsLoading ] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    
    useEffect(()=> {
        unauthrizedTheatres()
    },[successMessage])

    const unauthrizedTheatres = async () => {
        try {

            const res = await TheatreApi.get('theatreowners/')
            setEnquery(res.data.enquery)

        }catch(e) {
            setError(e.response?.message || 'error occurss')
        }
    }
    const handleAccept = async (ownerProfile_id , user_id) => {
      try {
        setIsLoading(true)
        setError  
        const res = await TheatreApi.post('theatreowners/', {
            'id' :  ownerProfile_id ,
            'ownership_status' : 'confirmed',
            'userId' : user_id
        })
        setSuccessMessage({title : `${res.data.message}✅`})
        setTimeout(() => setSuccessMessage(''), 3000);

        }catch(e){
            console.log(e.response?.error || 'unexpected error occurs ')
        }

    }

    const handleDecline = async (ownerId , userId) => {
        
      try {
          setIsLoading(true)
            setError(null)
            const res = await TheatreApi.post('theatreowners/', {
                'id' : ownerId  ,
                'userId': userId ,
                'ownership_status' : 'rejected'
            })
            console.log(res.data)
            setSuccessMessage({ title  :`${res.data.message}❌`})
            // setTimeout(() => setSuccessMessage(''), 3000);

        }catch(e){
            setError(e.response?.data || 'unexpected error occurs ')
        }finally{
          setIsLoading(false)
        }
    }
    console.log(enquery)
    return (
        <div className='flex min-h-screen bg-gray-100'>
          <div className='w-full p-6 mt-10'>
            <h2 className='text-center font-semibold text-2xl mb-8'>Theatre Owners</h2>

            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-700">{successMessage}</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                        <span className="text-red-700">{error}</span>
                    </div>
                </div>
            )}
            {isLoading ? (
              <div className="flex justify-center items-center text-xl font-bold text-blue-600">
                Loading...
              </div>
            ) : enquery.length === 0 ? (
              <div className="flex justify-center text-gray-500 mt-5">No Enquiries Found</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {enquery.map((value) => (
                  <Card key={value.id} sx={{ maxWidth: 350 }}>
                    <CardContent>
                      <Typography variant="h5" component="div" className="mb-2 text-gray-700">
                        {value.theatre_name}
                      </Typography>
                      <div className='flex justify-center mb-3'>
                        <img
                          src={value.owner_photo  }
                          alt="owner_pic"
                          className='w-32 h-32 rounded-full object-cover'
                        />
                      </div>
                      <Typography variant="body2" className="mb-1">
                        <span className="text-gray-500 font-semibold">Location:</span> {value.location}
                      </Typography>
                      <Typography variant="body2" className="mb-1">
                        <span className="text-gray-500 font-semibold">State:</span> {value.state}
                      </Typography>
                      <Typography variant="body2" className="mb-1">
                        <span className="text-gray-500 font-semibold">Zipcode:</span> {value.pincode}
                      </Typography>
                      <Typography variant="body2" className="mt-2">
                        {value.message}
                      </Typography>
                    </CardContent>
                    <div className="py-3 px-5 flex gap-2 justify-end">
                      <Button variant="contained" color="success" onClick={() => handleAccept(value.id, value.user_id)}>
                        Accept
                      </Button>
                      <Button variant="outlined" color="error" onClick={() => handleDecline(value.id , value.user_id)}>
                        Decline
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }      

export default Enquery
