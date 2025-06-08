import apiBooking from '@/axios/Bookingapi';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Calendar , LanguagesIcon , Clock1 , Clapperboard , LollipopIcon , RockingChairIcon, LaptopMinimal , MailCheck } from 'lucide-react';
import { Email } from '@mui/icons-material';
function TicketDetails() {
    const [ ticket , setTicket ] = useState([]);
    const [ loading , setLoading ] = useState(true);
    const {id} = useParams();

    useEffect(() => {

        const fetchTicketDetails = async() => {
            try{
                const res = await apiBooking.get(`ticket/${id}/`)
                setTicket(res.data)
            }catch(e){
                console.log(e ,'error while fetching ticket view')
            }finally{
                setLoading(false)
            }
        }
        fetchTicketDetails()
    },[])

    const { ticket_data , movie_details , seats} = ticket;
    console.log(ticket_data , movie_details , seats )

  if (loading){
    return (
    <div className='flex justify-center items-center pt-[40%] h-64' >
    <div className='flex animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4' ></div>
    <div className="text-gray-700 text-lg">Loading Ticket...</div>
    </div>

    )

  }

  return (
    <div className="max-w-7xl w-full mx-auto bg-white shadow-xl rounded-2xl p-10 mt-10 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">🎟️ Movie Ticket</h2>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">
            Booking ID: <span className="font-semibold text-gray-700">{ticket_data.booking_id}</span>
          </p>
        </div>
        <img src={ticket_data.qrcode_img} alt="QR Code" className="w-24 h-24 rounded-md border" />
      </div>

      {/* Movie Details */}
      <div className="grid grid-cols-2 gap-10 text-sm p-8 text-gray-700 mb-6">
        <div>
          <p className="font-medium text-gray-600"><Clapperboard className='inline' /> Movie Title:</p>
          <p className="text-gray-800 font-semibold">{movie_details.title}</p>
        </div>
        <div>
          <p className="font-medium text-gray-600"><Calendar className='inline' /> Release Date:</p>
          <p className="text-gray-800 font-semibold">{movie_details.release_date}</p>
        </div>
        <div>
          <p className="font-medium text-gray-600"> <LanguagesIcon className='inline' /> Language:</p>
          <p className="text-gray-800 font-semibold">{movie_details.language}</p>
        </div>
        <div>
          <p className="font-medium text-gray-600"><Clock1 className='inline' /> Duration:</p>
          <p className="text-gray-800 font-semibold">{movie_details.duration} mins</p>
        </div>
      </div>

      {/* Ticket Details */}
      <div className="grid grid-cols-2 gap-6 text-sm p-8 text-gray-700 mb-4">
        <div>
          <p className="font-medium text-gray-600"><LollipopIcon className='inline' /> Theatre:</p>
          <p className="text-gray-800 font-semibold">{ticket_data.theatre}</p>
        </div>
        <div>
          <p className="font-medium text-gray-600"><LaptopMinimal className='inline' /> Screen:</p>
          <p className="text-gray-800 font-semibold">
            Screen {ticket_data.screen_number} ({ticket_data.screen_type})
          </p>
        </div>
        <div>
          <p className="font-medium text-gray-600"><MailCheck className='inline' /> Email:</p>
          <p className="text-gray-800 font-semibold">{ticket_data.email}</p>
        </div>
        <div>
          <p className="font-medium text-gray-600"><Clock1 className='inline'/> Booking Time:</p>
          <p className="text-gray-800 font-semibold">{ticket_data.booking_time}</p>
        </div>
      </div>

      {/* Seats */}
      <div className="text-sm text-gray-700 p-6">
        <p className="font-medium text-gray-600 mb-2 "><RockingChairIcon className='inline' /> Booked Seats:</p>
        <div className="flex flex-wrap gap-2">
          {seats.map((seat, index) => (
            <span
              key={index}
              className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold"
            >
              {seat}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TicketDetails
