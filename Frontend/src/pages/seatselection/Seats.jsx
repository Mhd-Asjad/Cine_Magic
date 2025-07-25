import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { X , ShieldAlert } from 'lucide-react';
import screenimg from '../../assets/screen.png'
import seatsApi from '@/axios/seatsaApi';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { lockseats } from '@/redux/features/selectedseats';
import { toast } from 'sonner';
import apiMovies from '@/axios/Moviesapi';
import Modal from '@/components/modals/Modal';
import AuthContainer from '../userauth/AuthContainer';
function Seats() {
  const {screenId , showId } = useParams();
  const [seats , setSeats] = useState([])
  const [show , setShow] = useState([])
  const [ selectedSeats , setSelectedSeats] = useState([]);
  const [loading , setLoading ] = useState(true);
  const [error , setError ] = useState(null)
  const [totalPrice , setTotalPrice] = useState(0);
  const [isModalOpen , setIsModalOpen] = useState(false);
  const [isLogin , setIsLogin] = useState(false);

  const dispatch = useDispatch();
  const username1 = useSelector((state) => state.user.username)
  const [priceCategories , setPriceCategories ] = useState([])
  const [searchparams]  = useSearchParams()
  const slotId = searchparams.get('slot_id') || null;
  console.log(slotId , 'slot id from search params')
  const navigate = useNavigate();
  useEffect(() =>{
    const fetchSeats = async() => {
      try{
        const res = await seatsApi.get(`screens/${screenId}/seats/?show_id=${showId}`)
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
        const res = await apiMovies.get(`/show-detail/${showId}/`,{
          params :{
            'slot_id' : slotId
          }
        })
        setShow(res.data)
      }catch(e){
        console.log(e?.response)
      }
    }

    fetchSeats()
    fetchShowDetails()
  },[screenId])


  const toggleSeatSelection = (seat) => {
    if (selectedSeats.length >= 10 && !selectedSeats.some(s => s.id === seat.id)) {
      toast('You can select a maximum of 10 seats at a time!',{
        icon: <ShieldAlert className='w-6 h-6 text-red-500' />,

      });
      return;
    }
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
    if (!Array.isArray(seats)) return {}; // 🚨 guard clause

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

  console.log(selectedSeats , 'seats' , showId , 'showid')

  useEffect(() => {
    const price = selectedSeats.reduce((sum , seat) => sum + seat.price,0);

    setTotalPrice(price);

  },[selectedSeats])

  const openModal = () => setIsModalOpen(true);
  const closeModal = ()  => {
    setIsModalOpen(false);
  }
  const proceedToCheckout = async() => {
    if (!username1) {
      setIsLogin(true)
      openModal()
      return;

    }
    const selectedSeatsIds = selectedSeats.map(seat => seat.id)
    console.log(selectedSeatsIds , 'selected seats ids')
    const payload = {
      'show_id': showId,
      'seats_ids': selectedSeatsIds
    }

    // to set lock if user is proceed to checkout
    try {
      const res = await seatsApi.post('lock-seats/', payload )
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
        navigate(`/seat-layout?booking_slot=${slotId}`)
      }
    }catch(e) {
      console.log(e?.response?.data || e.message || e)
      toast(
         e?.response?.data?.error || 'error occur',{
          icon: <ShieldAlert className='w-6 h-6 text-red-500' />,
        
      })
    }

  }

  console.log(show , 'shows')
  if (loading) {
    return (
      <div className='flex justify-center items-center pt-[20%] h-64' >
        <div className='flex animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4' ></div>
        <div className="text-gray-700 text-lg">Loading seats...</div>

      </div>
    )
  }
  const formatTime = (timeString) => {
    const [hours , minutes] = timeString?.split(':');
    const date = new Date();
    date.setHours(hours , minutes)
    return date.toLocaleTimeString([] , {hour : '2-digit' , minute : '2-digit' , hour12:true});
  }

  console.log(seats , 'show_details')
  return (
    <div className='min-h-screen w-full bg-gray-50'>
      <div className='bg-blue-50 w-full shadow-md p-8 '>
        <div className='' >

          <h2 className='ml-[12%] text-xl font-bold text-gray-800' >{show.movie_title}</h2>
          < p className='font-medium ml-[12%] mt-3' >◉ {show.show_date} , {formatTime(show?.slot?.start_time)}  { show.slot.end_time ? `to ${formatTime(show.slot?.end_time)}`:''} {show.theatre_name} {show.theatre_details}</p>

        </div>
      <div className="flex justify-end px-10  space-x-3 sm:space-x-2 mt-4">
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
          const isRowUnavailable = rowSeats.every(seat => !seat.label);


        return (
          <div key={row} className="w-full mb-3">
            {group && (
              <div className="text-center font-semibold text-lg mb-2">
                {group.category}
              </div>
            )}

            <div className="flex justify-center w-full mb-2">
          <div className="w-6 font-bold mr-2">{row}</div>

            {isRowUnavailable ? (
              <div className="text-gray-400 italic text-sm">Row Unavailable <X className='inline' /></div>
            ) : (
              <div className="flex space-x-2 gap-2">
                {rowSeats.map(seat =>
                  seat?.label ? (
                    <button
                      key={seat.id}
                      className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs ${getSeatClass(seat)}`}
                      onClick={() => toggleSeatSelection(seat)}
                      disabled={seat.is_booked}
                    >
                      {seat.number}
                    </button>
                  ) : (
                    <div key={seat.id} className="w-6 h-6" />
                  )
                )}
              </div>
            )}
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


      <Modal isOpen={isModalOpen} closeModal={closeModal}  >

        <AuthContainer isModalClose={closeModal} Logined={isLogin} />
        
      </Modal>
    </div>
  )
}

export default Seats