import React from 'react'
import { useSelector } from 'react-redux'
import TheatreApi from '@/axios/theatreapi'
import { useEffect , useState } from 'react'
import { Coins } from "lucide-react";
import { useNavigate } from 'react-router-dom';

function ShowBookings() {
    const [bookings , setBookings] = useState([])
    const [loading , setLoading] = useState(true)
    const navigate = useNavigate();
    const theatre_owner_id = useSelector((state) => state.theatreOwner.theatreId)


    useEffect(() => {
        const fetchBookings = async () => {
        try {
            const response = await TheatreApi.get(`get-theatre-booking/?owner_id=${theatre_owner_id}`);
            console.log(response.data.booking_data)
            setBookings(response.data.booking_data);
        }catch (error) {
            console.error("Error fetching bookings:", error);
        }
        };
        fetchBookings();
    },[])

    const StatusBadge = ({ status }) => {
        const getStatusStyle = () => {
          switch (status?.toLowerCase()) {
            case "cancelled":
              return "bg-red-100 text-red-800 border-red-200";
            case "completed":
              return "bg-green-100 text-green-800 border-green-200";
            default:
              return "bg-gray-100 text-gray-800 border-gray-200";
          }
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle()}`}>
            {status || "Unknown"}
          </span>
        );
    }
    const formattTime = (timeString) => {
    const [hours , minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours , minutes)
    return date.toLocaleTimeString([] , {hour : '2-digit' , minute : '2-digit' , hour12:true});
    }

    const onShowBooking = (booking_id) => {
        navigate(`/theatre-owner/show/booking/${booking_id}`)
        

    }
    console.log(bookings , 'bookings show theatre')
  return (
    <div className="w-full min-h-screen bg-gray-100 py-6">
    <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">Booking Details</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="min-w-full text-left divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">No</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Theatre</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Show Details</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-600 uppercase text-center tracking-wider">Action</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {bookings.length > 0 ? (
                bookings.map((booking, index) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="font-medium">{booking.theatre_name}</div>
                        <div className="text-xs text-gray-500 font-semibold">Screen: {booking.screen_number}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="font-medium">{booking.booking_id}</div>
                        <div className="text-xs text-gray-500">Show: {booking.movie_name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="font-medium">{booking.user_name}</div>
                        <div className="text-xs text-gray-500">{booking.user_email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="font-medium">{booking.movie_name}</div>
                        <div className="text-xs">{new Date(booking.show_date).toLocaleDateString()} - {formattTime(booking.start_time)}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ₹{parseFloat(booking.total_price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                        <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-center">
                        <button
                        onClick={() => onShowBooking(booking.id)}
                        className="inline-flex items-center px-3 py-2 border-dashed border-2 text-sm font-medium rounded-md hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                        <Coins className="w-4 h-4 mr-1" />
                        Show Details
                        </button>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="8" className="text-center py-6 text-gray-500">
                    No bookings available
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
        </div>
    </div>
    </div>
  )
}

export default ShowBookings