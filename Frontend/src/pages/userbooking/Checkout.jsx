import Nav from '@/components/navbar/Nav';
import axios from 'axios'
import React ,{useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { ChevronUp, ChevronDown, Clock, MapPin, Calendar, Users, Film } from 'lucide-react';
import Paypalcomponet from './Paypalcomponet';
import CountDownTimer from '../seatselection/CountDownTimer';
import seatsApi from '@/axios/seatsaApi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { clearSelection , expireLock } from '@/redux/features/selectedseats';
import apiBooking from '@/axios/Bookingapi';
import { useDispatch } from 'react-redux';

function Checkout() {
  const [checkoutItems , setCheckoutItems] = useState({});
  const [searchparams] = useSearchParams();
  const slot_id = searchparams.get('booking_slot')
  const userId = useSelector((state) => state.user.id )
  const { selectedSeats , showId , lockExpiry } = useSelector((state) => state.selectedSeats);
  console.log(selectedSeats , showId , lockExpiry ,'from check comp')
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [taxesOpen, setTaxesOpen] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const TAX_RATE = 0.1;
  const cleanedExpairyTime = lockExpiry.replace(/\.\d{6}/, '')
  const lockExpiryTime = new Date(cleanedExpairyTime)
  const now = new Date()

  const params = new URLSearchParams();
  selectedSeats.forEach(id => params.append('selectedseats' , id))
  params.append('show_id' , showId)
  params.append('booking_slot' , slot_id)
  
  const from = location;
  console.log(userId)
  
  useEffect(() => {
    const checkout = async() => {
      
      try {
        console.log('inside useEffect')
        console.log(selectedSeats)
        
        const res = await apiBooking.get(`checkout/?${params.toString()}`)
        console.log(res.data)
        setCheckoutItems(res.data)
      }catch(e) {
        console.log(e?.response)
      }
    }
    checkout()
  },[])

    useEffect(() => {
    const handleBackButton = async(event) => {
      console.log("Back button pressed on Checkout Page");
        try {
          const res = await seatsApi.post('/unlock-seats/',{
          'selected_seats' : selectedSeats ,
          'show_id' : showId,
          'action' : 'eventbacked'
          });


          console.log(res.data.message , 'clear seats')
          dispatch(expireLock());
          console.log('seat lock cleared on back')
        }catch(error){
          
          console.log('error while seat ublock on click event' , error)
          
        }
      };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);


  console.log(checkoutItems ,'value')
  const {
    show_det = {},
    seat_data = [],
    total_amount = 0,
    show_time = {},
    theatre = {},
    screen = {},
    category = ''
  } = checkoutItems; 

  const formatDate = (dateStr) => {
    console.log(dateStr)
    const date = new Date(dateStr);
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
  };
    
  console.log(show_time.time)
  function formatTime(timeStr) {
    if (!timeStr)return
    let [hour, minute, second] = timeStr.split(':').map(Number);
    let ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  }
  const formattedTime = formatTime(show_time.time) 
  const formattedDate = formatDate(show_time.date);
  const handlePaymentSuccess = async(paymentDetails) => { 
    console.log('entered into booking creation ') 
    console.log('paymentdet' ,paymentDetails)
    try {
      const res = await apiBooking.post('create-booking/',{
        user_id : userId ,
        show_id : showId ,
        booking_slot : slot_id,
        selected_seats : selectedSeats,
        payment_details : paymentDetails ,
        total_amount: checkoutItems.total_amount ,

      },{
        withCredentials : true
      })
      const { booking_id } = res.data

      navigate(`/payment/${booking_id}/success`)
    }catch(e){
      console.log(e)
      console.log(e?.response?.data || 'error occurs')
    }
  }

  // ublocking sessions after lock expiry time exeeded throught CountDownTimer component
  const handleSessionExpiry = async() => {

    try {
      const res = await seatsApi.post('/unlock-seats/',{
        'selected_seats' : selectedSeats ,
        'show_id' : showId,
      })
      const {movie_id} = res.data
      console.log('expaired session.....!')
      navigate(`/movie/${movie_id}/details`)

    }catch(e){
      console.log(e.response?.data?.error)
    }
    
  }

  if (now > lockExpiryTime){
    const isExpired = handleSessionExpiry()
    console.log(isExpired)
  }
  console.log(selectedSeats , 'selected seatss')
  useEffect(() => {
    const checkIsPaymentDone = async() => {
      try{
        const res = await apiBooking.get('verify/', {
          params:{
            'show_id': showId , 
            'selected_seats' : selectedSeats
          }
        })
        if (res.data.success && res.data.booking ) {
          navigate('/')
        }

      }catch(e){
        console.log(e)
      }
    }
    checkIsPaymentDone()

  },[])

  console.log(checkoutItems)
 return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <CountDownTimer onExpiresAT={lockExpiry} onExpire={handleSessionExpiry} />
          
          {/* Mobile Layout */}
          <div className="block lg:hidden p-4 space-y-6">
            {/* Movie Info Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex space-x-4">
                <img 
                  src={show_det.poster} 
                  alt={show_det.name} 
                  className="w-20 h-28 sm:w-24 sm:h-32 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                    {show_det.name}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                      UA13+
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                      {show_det.language}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                      2D
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{theatre.name}</p>
                      <p className="text-xs text-gray-500">{theatre.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-900">{formattedDate}, {formattedTime}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Film className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{screen.screen_type}, Screen {screen.screen_number}</span>
                  </div>
                  
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {seat_data.length} {seat_data.length === 1 ? 'Ticket' : 'Tickets'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{seat_data.length}</div>
                      <div className="text-xs text-gray-500">SEATS</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Booking Summary Section */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Booking Summary</h3>
                <button 
                  onClick={() => setDetailsOpen(!detailsOpen)}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  Details {detailsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-900">
                    {seat_data.length} {seat_data.length === 1 ? 'Ticket' : 'Tickets'}
                  </span>
                  <span className="text-sm font-medium text-gray-900">₹{total_amount}</span>
                </div>
                
                {detailsOpen && (
                  <div className="bg-white rounded p-3 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>{seat_data.length} × {category} @ ₹{total_amount / seat_data.length}</span>
                      <span>₹{total_amount}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900">Taxes & Fees</span>
                    <button 
                      onClick={() => setTaxesOpen(!taxesOpen)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      {taxesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                  <span className="text-sm font-medium text-gray-900">₹{Math.round(total_amount / 10)}</span>
                </div>
                
                {taxesOpen && (
                  <div className="bg-white rounded p-3 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>Booking charges (incl. taxes)</span>
                      <span>₹{Math.round(total_amount / 10)}</span>
                    </div>
                  </div>
                )}
                
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Grand Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{total_amount + Math.round(total_amount / 10)}
                    </span>
                  </div>
                </div>
                
                {/* PayPal Component for Mobile */}
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <Paypalcomponet 
                    onPaymentSuccess={handlePaymentSuccess} 
                    amount={total_amount + Math.round(total_amount / 10)} 
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden lg:block p-6">
            <div className="flex space-x-8">
              {/* Movie Info Section */}
              <div className="flex-1">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex space-x-6">
                    <img 
                      src={show_det.poster} 
                      alt={show_det.name} 
                      className="w-32 h-48 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">{show_det.name}</h2>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                          UA13+
                        </span>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                          {show_det.language}
                        </span>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                          2D
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{theatre.name}</p>
                            <p className="text-xs text-gray-500">{theatre.location}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-900">{formattedDate}, {formattedTime}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Film className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{screen.screen_type}, Screen {screen.screen_number}</span>
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-gray-900">{seat_data.length}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">
                              {seat_data.length === 1 ? 'Ticket' : 'Tickets'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Booking Summary Section */}
              <div className="w-80">
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 sticky top-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Booking Summary</h3>
                    <button 
                      onClick={() => setDetailsOpen(!detailsOpen)}
                      className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                      Details {detailsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900">
                        {seat_data.length} {seat_data.length === 1 ? 'Ticket' : 'Tickets'}
                      </span>
                      <span className="font-medium text-gray-900">₹{total_amount}</span>
                    </div>
                    
                    {detailsOpen && (
                      <div className="bg-white rounded-lg p-4 text-sm text-gray-500">
                        <div className="flex justify-between">
                          <span>{seat_data.length} × {category} @ ₹{total_amount / seat_data.length}</span>
                          <span>₹{total_amount}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-gray-900">Taxes & Fees</span>
                        <button 
                          onClick={() => setTaxesOpen(!taxesOpen)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          {taxesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                      <span className="font-medium text-gray-900">₹{Math.round(total_amount / 10)}</span>
                    </div>
                    
                    {taxesOpen && (
                      <div className="bg-white rounded-lg p-4 text-sm text-gray-500">
                        <div className="flex justify-between">
                          <span>Booking charges (incl. taxes)</span>
                          <span>₹{Math.round(total_amount / 10)}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-300 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900">Grand Total</span>
                        <span className="text-xl font-bold text-gray-900">
                          ₹{total_amount + Math.round(total_amount / 10)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-gray-300">
                      <Paypalcomponet 
                        onPaymentSuccess={handlePaymentSuccess} 
                        amount={total_amount + Math.round(total_amount / 10)} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout