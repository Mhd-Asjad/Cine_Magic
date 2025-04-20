import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import Nav from '@/Components/Navbar/Nav';
import screenimg from '../../assets/screen.png'
import seatsApi from '@/Axios/seatsaApi';

function Seats() {
  const {id} = useParams();
  const [seats , setSeats] = useState([])
  const [ selectedSeats , setSelectedSeats] = useState([]);
  const [loading , setLoading ] = useState(true);
  const [error , setError ] = useState(null)
  const [totalPrice , setTotalPrice] = useState(0);
  useEffect(() =>{
    const fetchSeats = async() => {
      try{
        const res = await axios.get(`http://127.0.0.1:8000/seats/screens/${id}/seats/`)
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
    fetchSeats()
  },[id])

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
    if (selectedSeats.some(s => s.id === seat.id)) return "bg-blue-500 outline-blue text-white cursor-pointer";
    return "bg-white text-blue cursor-pointer outline outline-1 outline-blue-600"
  }

  const organizeByRow = (seats) => {
    console.log(seats , 'inside orgainer')
    const rowMap = {};
    seats.forEach(seat => {
      if (!rowMap[seat.row]) {
        rowMap[seat.row] = [];
      }
      rowMap[seat.row].push(seat)
    });
    Object.values(rowMap).map(rowSeats => {
      rowSeats.sort((a , b) => a.number - b.number)
    })
    return rowMap;
  }

  useEffect(() => {
    const price = selectedSeats.reduce((sum , seat) => sum + seat.price,0);

    setTotalPrice(price);

  },[selectedSeats])
  console.log(selectedSeats , 'selected seats')
  if (loading) {
    return (
      <div className='flex justify-center items-center pt-[20%] h-64' >
        <div className='flex animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4' ></div>
        <div className="text-gray-700 text-lg">Loading seats...</div>

      </div>
    )
  }
  
  return (
    <div className='min-h-screen w-full bg-gray-50' >

      <div className='bg-blue-50 w-full shadow-md p-8 ' >
      <div className="flex justify-end px-10  space-x-8 pt-5 ">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-white outline outline-1 outline-blue-600 rounded-sm mr-2"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-400 rounded-sm mr-2"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-400 rounded-sm mr-2"></div>
          <span>Booked</span>
        </div>
      </div>
      </div>
      <h2 className="text-2xl mb-5 font-bold text-center mt-8">Select Your Seats</h2>
      
     
      <div className="flex flex-col items-center mb-2">
          {Object.entries(seats).map(([row , rowSeats]) => (
            <div key={row} className="flex justify-center w-full mb-4">
              <div className="w-6 font-bold mr-2">{row}</div>
              <div className="flex space-x-2 gap-1">
                {rowSeats.map(seat => (
                  <button
                    key={seat.id}
                    className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs ${getSeatClass(seat)}`}
                    onClick={() => toggleSeatSelection(seat)}
                    // disabled={seat.is_booked}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>
            </div>
          ))}
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
