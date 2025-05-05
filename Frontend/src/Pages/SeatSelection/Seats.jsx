import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import Nav from '@/Components/Navbar/Nav';
import screenimg from '../../assets/screen.png'
import seatsApi from '@/Axios/seatsaApi';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { lockseats } from '@/Redux/Features/selectedseats';
import Checkout from '../userbooking/Checkout';
import { useToast } from '@/hooks/use-toast';
function Seats() {
  const {screenId , showId } = useParams();
  const [seats , setSeats] = useState([])
  const [show , setShow] = useState([])
  const [ selectedSeats , setSelectedSeats] = useState([]);
  const [loading , setLoading ] = useState(true);
  const [error , setError ] = useState(null)
  const [totalPrice , setTotalPrice] = useState(0);
  const dispatch = useDispatch();
  const {toast} = useToast();
  const username1 = useSelector((state) => state.user.username)
  const selectedCity = useSelector((state) => state.location.location)
  const [priceCategories , setPriceCategories ] = useState([])
  const navigate = useNavigate();
  useEffect(() =>{
    const fetchSeats = async() => {
      try{
        const res = await axios.get(`http://127.0.0.1:8000/seats/screens/${screenId}/seats/?show_id=${showId}`)
        console.log(res.data ,'values')

        const organizedData = organizeByRow(res.data) 
        setSeats(organizedData)
        setError(null)
        setLoading(false)
      }catch(e){
        setError('failed to load seats. please try again.')
        console.log(e)
        setLoading(true)

      }
    }
    const fetchShowDetails = async() => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/movies/show-detail/${showId}/`)
        setShow(res.data)
      }catch(e){
        console.log(e?.response)
      }
    }

    fetchSeats()
    fetchShowDetails()
  },[screenId])


  const toggleSeatSelection = (seat) => {
    setSelectedSeats(prev => {
      const isSeatSelected = prev.some(s => s.id === seat.id);
      if (isSeatSelected) {
        return prev.filter(s => s.id !== seat.id)
      }else {
        return[...prev , seat]
      }
    })
  }

  const getSeatClass = (seat) => {
    if (seat.is_booked) return 'bg-gray-400 text-white cursor-not-allowed'
    if (selectedSeats.some(s => s.id === seat.id)) return "bg-blue-500 outline-blue text-white cursor-pointer";
    return "bg-white text-blue cursor-pointer outline outline-1 outline-blue-600"
  }
  
  const organizeByRow = (seats) => {

    const rowMap = {};
    const priceRange = {}
    seats.forEach(seat => {
      if (!rowMap[seat.row]) {
        rowMap[seat.row] = [];
      }
      rowMap[seat.row].push(seat)
    });
    
    for (const [row , seatsInRow] of Object.entries(rowMap)) {
      
      if (seatsInRow.length > 0 ) {
        const key = `${seatsInRow[0].category_name}-₹${seatsInRow[0].price}`
        if (!priceRange[key] ){
          priceRange[key] = []
          priceRange[key].push({
            row
          })
        }
      }

    }

    const convertData = Object.entries(priceRange).map(([key , row])=> ({
      category : key , 
      rows : row
    }))
    setPriceCategories(convertData)
    return rowMap;
  }

  console.log(seats , 'seats')

  useEffect(() => {
    const price = selectedSeats.reduce((sum , seat) => sum + seat.price,0);

    setTotalPrice(price);

  },[selectedSeats])

  const proceedToCheckout = async() => {
    if (!username1) {
      toast({title : 'please login and checkout'})
      return;
    }
    const selectedSeatsIds = selectedSeats.map(seat => seat.id , [])
    console.log(selectedSeatsIds , 'selected seats ids')
    const payload = {
      'show_id': showId,
      'seats_ids': selectedSeatsIds
    }
    try {
      const res = await axios.post('http://127.0.0.1:8000/seats/lock-seats/', payload )
      console.log(res.data , 'response from checkout')
      console.log(res.data.expires_at)
      if (res.status === 200) {
        console.log(selectedSeatsIds , showId , 'inside the success block')
        
        console.log('beforedispatch')
        dispatch(lockseats({
          seatIds : selectedSeatsIds ,
          showId : showId ,
          expiresAt : res.data.expires_at

        }));
        console.log('after dispatch');
        navigate(`/seat-layout/${selectedCity}`)
      }
    }catch(e) {
      toast({
        
        title : e.response?.data?.error
        
      })
    }

  }

  console.log(selectedSeats , 'selected seats')
  if (loading) {
    return (
      <div className='flex justify-center items-center pt-[20%] h-64' >
        <div className='flex animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4' ></div>
        <div className="text-gray-700 text-lg">Loading seats...</div>

      </div>
    )
  }
  const formatTime = (timeString) => {
    const [hours , minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours , minutes)
    return date.toLocaleTimeString([] , {hour : '2-digit' , minute : '2-digit' , hour12:true});
  }

  console.log(show)
  return (
    <div className='min-h-screen w-full bg-gray-50'>
      <div className='bg-blue-50 w-full shadow-md p-8 '>
        <div className='' >

          <h2 className='ml-[12%] text-xl font-bold text-gray-800' >{show.movie_title}</h2>
          < p className='font-medium ml-[12%] mt-3' >◉ {show.show_date} , {formatTime(show.start_time)}  { show.end_time ? `to ${formatTime(show.end_time)}`:''} {show.theatre_name} {show.theatre_details}</p>

        </div>
      <div className="flex justify-end px-10  space-x-8 pt-5 ">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-white outline outline-1 outline-blue-600 rounded-sm mr-2"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-sm mr-2"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-400 rounded-sm mr-2"></div>
          <span>Booked</span>
        </div>
      </div>
      </div>
      <h2 className="text-2xl mb-5 font-semibold text-center mt-8">Select Your Seats</h2>
      
     
      <div className="flex flex-col items-center mb-2">
      {Object.entries(seats).map(([row, rowSeats]) => {
        const group = priceCategories.find(group =>
          group.rows.some(rowObj => rowObj.row === row)
        );

        return (
          <div key={row} className="w-full mb-3">
            
            {group && (
              <div className="text-center font-semibold text-lg mb-2">
                {group.category}
              </div>
            )}

            <div className="flex justify-center w-full mb-2">
              <div className="w-6 font-bold mr-2">{row}</div>
              <div className="flex space-x-2 gap-2">
                {rowSeats.map(seat => (
                  
                  seat?.label ? (
                    <button
                      key={seat.id}
                      className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs ${getSeatClass(seat)}`}
                      onClick={() => toggleSeatSelection(seat)}
                      disabled={seat.is_booked}
                    >
                      {seat.number}
                    </button>

                  ):(
                    <div key={seat.id} className="w-6 h-6"/>
                  )
                ))}
              </div>
            </div>

          </div>
        );
      })}
        </div>

      <div className="relative mb-8 pb-28 z-0">
        <div className="flex justify-center ">
         <img src={screenimg} className='w-[25%] mt-3' alt="screen image" ></img>
        </div>
      </div>

  
      
    {selectedSeats.length > 0 && (


    <div className="bg-gray-100 w-[50%]  rounded-lg fixed bottom-2 left-1/2 transform -translate-x-1/2 shadow-lg z-10">
      <div className="flex justify-between px-2 mb-2">
        <span className='font-bold' >Selected Seats:</span>
        <span className='font-semibold' >
          {selectedSeats.length > 0 
            ? selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ') 
            : 'None'}
        </span>
      </div>
      <div className="flex justify-center font-bold">
        <span>Total Price :&nbsp;</span>
        <span>₹{totalPrice}</span>
      </div>
      <div className="mt-4 flex justify-center">
        <button 
        className="w-[60%] bg-blue-600 text-white py-2 mb-1 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        onClick={proceedToCheckout}
          disabled={selectedSeats.length === 0}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
      )}
    </div>
  )
}

export default Seats
