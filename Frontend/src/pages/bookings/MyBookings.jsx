import React, { useEffect, useState } from 'react'
import Nav from '@/components/navbar/Nav'
import { useSelector } from 'react-redux'
import notFound from '../../assets/no-booking.png'
import { useNavigate } from 'react-router-dom'
import apiBooking from '@/axios/Bookingapi'
import { CircleCheckBig, Star , ShieldAlert } from 'lucide-react'
import CustomAlert from '@/components/CustomAlert'
import { 
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import { toast } from 'sonner'
import apiReview from '@/axios/Reviewapi'

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

function MyBookings() {
    const userId = useSelector((state) => state.user.id)
    const [ bookings, setBookings] = useState([]);
    const [ loading, setLoading] = useState(true);
    const [ error, setError] = useState(null);
    const [ showReviewForm , setShowReviewForm] = useState(false)
    const [ message , setMessage] = useState()
    const [ review , setReview] = useState('')
    const [ selectedShow , setSelectedShow] = useState(null)
    const [ value, setValue ] = React.useState(2);
    const [ hover, setHover] = React.useState(-1);

    const navigate = useNavigate();
    useEffect(() => {
        const fetchBookings = async() => {
            if (!userId) {
                setLoading(false)
                return;
            }
        
            console.log('api calling in orders')
            try {
                const res = await apiBooking.get(`my-bookings/${userId}/`);
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

    const handleRating = (booking) => {
        const now = new Date()
        setSelectedShow(booking)
        const showDate = booking.show.show_date
        const endTime =  booking.show.end_time 

        const endDateTimeString = `${showDate}T${endTime}`;
        const endDateTime = new Date(endDateTimeString)

        if (now > endDateTime) {
            setShowReviewForm(true)

        }else{
            setMessage('Post Review After show ends')
        }   

    }

    console.log(selectedShow)


    const handleSubmit = async() => {
        try {
            const current_user_type = localStorage.getItem('current_user_type')
            const authToken = localStorage.getItem(`${current_user_type}_token`)
            const res = await apiReview.post(`rate-movie/${selectedShow.id}/`, {
                'rating' : value,
                'review' : review,
            },{
                headers: {
                    Authorization : `Bearer ${authToken}` ,
                    'Content-Type': 'application/json'
                }
            })
            toast(res.data.message,{
                icon: <CircleCheckBig className='text-green-500' />,
                style: {
                    background: '#f0fff4',
                    color: '#065f46',
                },
            })
            setShowReviewForm(false)

        }catch(e){s
            console.log(e)
            toast(e?.response?.data?.error,{
                icon: <ShieldAlert className='text-red-500' />,
                style: {
                    background: '#fee2e2',
                    color: '#b91c1c',
                },
            })
        }
    }
    
    useEffect(() => {
        const interval = setInterval(() => {
            setMessage('')
        },4000)

        return () => clearInterval(interval)
    },[message])

  console.log(selectedShow)
  return (
    <div className="min-h-screen bg-gray-50 ">
        <Nav/>

        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 mt-10">
            {message &&
                <CustomAlert  setMessage={setMessage} message={message} isError={true} title={'Alert'} />
            }
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
                        
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
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
                                                <div className='flex mt-2 gap-2 justify-end mb-2 ' >

                                                <button 
                                                    className='outline outline-2 px-2 py-2 text-black rounded-md outline-blue-200' 
                                                    onClick={() => navigate(`/booking/${booking.id}/ticket`)}
                                                >

                                                 Ticket Overview
                                                </button>
                                                <div>
                                                <button
                                                className="outline outline-2 px-2 py-2 text-green rounded-md outline-green-200"
                                                onClick={() => {handleRating(booking)}}
                                                >
                                                rate now <Star className="inline" />
                                                </button>
                                            </div>

                                            <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                                            <DialogContent className="sm:max-w-md">
                                                <DialogHeader>
                                                <DialogTitle className="flex justify-center items-center">
                                                    Rate Your Experience For ({selectedShow?.show?.movie})
                                                </DialogTitle>
                                                </DialogHeader>

                                                <div className="flex justify-center items-center flex-col">
                                                <Box sx={{ width: 200, display: 'flex', alignItems: 'center' }}>
                                                    <Rating
                                                    name="hover-feedback"
                                                    value={value}
                                                    size='large'
                                                    precision={0.5}
                                                    getLabelText={getLabelText}
                                                    onChange={(event, newValue) => setValue(newValue)}
                                                    onChangeActive={(event, newHover) => setHover(newHover)}
                                                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                                    />
                                                    {value !== null && (
                                                    <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
                                                    )}
                                                </Box>
                                                    <textarea
                                                    rows="4"
                                                    placeholder="Write your review here... ( Optional )"
                                                    value={review}
                                                    onChange={(e) => setReview(e.target.value)}
                                                    className="w-full mt-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                    />                                                
                                                </div>

                                                <DialogFooter className="gap-2">
                                                <button
                                                    onClick={() => {
                                                    setShowReviewForm(false);
                                                    setSelectedShow(null)
                                                    }}
                                                    className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSubmit}
                                                    className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600"
                                                >
                                                    Submit
                                                </button>
                                                </DialogFooter>
                                            </DialogContent>
                                            </Dialog>

                                                </div>
                                            <div>

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