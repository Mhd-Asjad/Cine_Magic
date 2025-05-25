import Nav from '@/Components/Navbar/Nav';
import axios from 'axios'
import React ,{useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import Paypalcomponet from './Paypalcomponet';
import CountDownTimer from '../SeatSelection/CountDownTimer';
import seatsApi from '@/Axios/seatsaApi';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import apiBooking from '@/Axios/Bookingapi';


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
  const location = useLocation();
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
    <div>

      <Nav/>
      <div className="flex flex-col bg-white rounded-lg shadow-md max-w-4xl mt-[4%] mx-auto my-4 p-4">
      <CountDownTimer onExpiresAT={lockExpiry} onExpire={handleSessionExpiry} />

      <div className="flex flex-row gap-4">
        <div className="flex flex-row bg-white p-4 rounded-lg">
          <img 
            src={show_det.poster} 
            alt={show_det.name} 
            className="w-32 h-48 object-cover rounded"
          />
          <div className="ml-4">
            <h2 className="text-xl font-bold">{show_det.name}</h2>
            <div className="flex flex-row gap-2 mt-2">
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">UA13+</span>
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">{show_det.language}</span>
              <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">2D</span>
            </div>
            
            <p className="mt-3 text-sm">{theatre.name}</p>
            <p className="text-xs text-gray-500 mt-1">{theatre.location}</p>
            
            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm">{formattedDate}, {formattedTime}</p>
                  <p className="text-xs text-gray-600 mt-1">{screen.screen_type}&nbsp;, screen : {screen.screen_number}&nbsp;&nbsp;</p>
                </div>
                <div className="text-center bg-gray-100 px-4 ml-8 py-2 rounded">
                  <div className="text-lg font-bold">{seat_data.length}</div>
                  <div className="text-xs">{ seat_data.length === 1 ? 'TICKET' : 'TICKETS'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-80 ml-[9%] bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Booking Summary</h3>
            <button 
              onClick={() => setDetailsOpen(!detailsOpen)}
              className="flex items-center text-xs text-gray-500"
            >
              Details {detailsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
          
          <div className="flex justify-between">
            <span>{seat_data.length} { seat_data.length === 1 ? 'Ticket' : 'Ticket'}</span>
            <span>₹{total_amount }</span>
          </div>
          {detailsOpen && (
            <div className='flex mb-3 gap-9' >
              <p className='text-sm text-gray-400'>{seat_data.length} X {category} each Tickets @ ₹{total_amount / seat_data.length }</p>
              <div className='flex justify-end w-full' >
              <span className='text-sm text-gray-400' >₹{total_amount / seat_data.length }</span>     
              </div>
          </div>
            
          )}
          
          <div className="flex justify-between mb-3">
            <div className="flex items-center">
              <span>Taxes & Fees</span>
              <button 
                onClick={() => setTaxesOpen(!taxesOpen)}
                className="ml-1"
              >
                {taxesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              
            </div>
                
            <span>₹{total_amount / 10 }</span>
          </div>
          {taxesOpen && (

          <div className='flex gap-[17%]' >
              <p className='text-sm text-gray-400'>Booking charge will include (taxes) </p>
              <div className='flex justify-end w-full' >

              <span className='text-sm text-gray-400' >₹{total_amount / 10 }</span>     
              </div>
          </div>
          )}
          
          <div className="border-t border-gray-300 my-4"></div>
          
          <div className="my-4">
            <h4 className="mb-2">Offers for you</h4>
            <div className="flex">
              <input
                type="text"
                placeholder="Enter promocode"
                className="border border-gray-300 rounded px-3 py-2 text-sm flex-1"
              />
              <button className="ml-2 bg-white text-blue-500 border border-blue-500 px-4 py-2 rounded text-sm">
                Apply
              </button>
            </div>
            <button className="text-blue-500 text-sm mt-2">
              View all offers or enter promocode
            </button>
          </div>
          
          <div className="border-t border-gray-300 my-4"></div>
          
          <div className="flex justify-between font-bold mb-4">
            <span>Grant Total</span>
            <span>₹{total_amount + total_amount / 10 }</span>
          </div>
          

          <div className='mt-4 mx-auto'>

            <Paypalcomponet onPaymentSuccess={handlePaymentSuccess} amount={total_amount + total_amount / 10} />
          </div>
          <div className="text-xs text-center text-gray-500 mt-3">
          </div>
        </div>
      </div>
    </div>

  </div>
  );
}

export default Checkout