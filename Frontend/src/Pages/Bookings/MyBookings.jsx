import React, { useEffect, useState } from 'react'
import Nav from '@/Components/Navbar/Nav'
import { useSelector } from 'react-redux'
import axios from 'axios'
import notFound from '../../assets/no-booking.png'
import { useNavigate } from 'react-router-dom'
function MyBookings() {
    const userId = useSelector((state) => state.user.id)
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchBookings = async() => {
            if (!userId) {
                setLoading(false)
                return;
            }
        
            console.log('api calling in orders')
            try {
                const res = await axios.get(`http://localhost:8000/booking/my-bookings/${userId}/`);
                setBookings(res.data.bookings);
                setLoading(false);
            } catch(e) {
                console.log(e.response || 'error occurs');
                setError('Failed to load bookings');
                setLoading(false);
            }
        };
        
        fetchBookings();
    }, [userId]);

    const formatTime = (timeString) => {
        const [hours , minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(hours , minutes)
        return date.toLocaleTimeString([] , {hour : '2-digit' , minute : '2-digit' , hour12:true});
      }
    
    
  return (
    <div className="min-h-screen bg-gray-50 ">
        <Nav/>

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 mt-10">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-medium text-gray-800">My Bookings</h2>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-10">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                            <p className="mt-2 text-gray-600">Loading your bookings...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-10">
                            <p className="text-red-500">{error}</p>
                        </div>
                    ) : bookings.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {bookings.map((booking, idx) => (
                                <div key={idx} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                                    <div className="bg-blue-50 px-4 py-2">
                                        <h3 className="font-medium text-blue-800 truncate">Booking #{booking.booking_id}</h3>
                                    </div>

                                    <div className="p-4">
                                        <div className="mb-4 flex justify-center">
                                            <h4 className="text-lg font-semibold text-gray-800">{booking.show.movie}</h4>
                                        </div>
                                        
                                        <div className="space-y-2 text-sm">

                                            <div className='flex justify-between' >
                                                <span className="text-gray-600">Show on :</span>
                                            <div className="flex items-center text-sm text-gray-600 mt-1">
                                                <span>{booking.show.show_date} at {formatTime(booking.show.start_time)}</span>
                                            </div>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Seats:</span>
                                                <span className="font-medium">{booking.seats.join(', ')}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Status:</span>
                                                <span className={`font-medium ${booking.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Amount:</span>
                                                <span className="font-medium">₹{booking.amount}</span>
                                            </div>
                      

                                            <div className="pt-2 text-xs text-gray-500 border-t border-gray-100">
                                                <div className='flex justify-end mb-2 ' >

                                                <button 
                                                    className='outline outline-2 px-2 py-2 text-black rounded-md outline-blue-200' 
                                                    onClick={() => navigate(`/booking/${booking.id}/ticket`)}
                                                >

                                                 Ticket Overview
                                                </button>
                                            </div>
                                           </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    ) : (
                        
                        <div className="text-center py-2">
                            <div className="inline-block p-3 rounded-ful">
                               <img src={notFound} alt="notfound" className='w-[320px] h-[300px] ' />
                            </div>

                            <p className="mt-4 text-2xl font-bold text-gray-800">No bookings found</p>
                            <p className="mt-2 text-gray-600">Your booked movie tickets will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default MyBookings