import React, { useEffect, useState } from 'react'
import TheatreApi from '@/Axios/theatreapi'
import { useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import TimePicker from 'react-time-picker'
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import * as Yup from 'yup';
import { Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { CircleAlert } from 'lucide-react'


function Addshowtime() {
  const {theatreId , screenId} = useParams();
  const [showTimes , setShowTimes ] = useState([])
  const [showAddForm, setShowAddForm] = useState(false);
  const [time , setTime ] = useState('12:00:00');
  const navigate = useNavigate();
  const {toast} = useToast();
  const [showId , setShowId] = useState(null)
  console.log(time)
  useEffect(() => {
    const fetchCurrentShowTime = async() => {
      try {
        const res = await TheatreApi.get(`/get_time-slots/?screen_id=${screenId}`)
        console.log(res.data)
        setShowTimes(res.data)
     
      }catch(e) {
        console.log(e)
      }
    }
    fetchCurrentShowTime()
  },[screenId])

  const handleSubmit = async(e) => {
    e.preventDefault()
    try {

      const res = await TheatreApi.post('/add-timeslot/ ' ,{
        'screen_id' : screenId ,
        'start_time' : time.length === 5 ? time + ':00' : time ,
      })
      toast({
        title : res.data.message , 
        variant : 'sucess'
      })
      navigate(`/theatre-owner/${theatreId}/screens`)


    }catch(e){
      console.log(e.response.data.error || 'An Error Occur')
      toast({
        description : e?.response?.data?.Error ,
        variant : 'destructive'

      });
      
    }
      

  }
  const formatTime = (timeString) => {
    if (!timeString) {
      return 'not defined'
    }
    const [hours , minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours , minutes)
    return date.toLocaleTimeString([] , {hour : '2-digit' , minute : '2-digit' , hour12:true});
  }

  const handleSeatEdit = (timeslot_id , showend) => {
    if (!showend){
      toast({title : 'no show created yet' ,
        variant : 'destructive'
      })
      return

    }
    navigate(`/theatre-owner/edit-show/${timeslot_id}`)

  }
  console.log(showId)
  return (
    <div className="min-h-screen bg-gradient-to-br to-indigo-100 p-8 mt-10 font-sans">
          <h1 className=" flex justify-center text-2xl md:text-3xl font-bold mb-4">Movie Showtimes</h1>
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-700 p-6">
          <p className="mt-1 text-gray-50 flex gap-1"><CircleAlert className=' text-yellow-300' />Try to add show time gap atleast 3 Hours</p>
        </div>
        
        <div className="p-6">
          {showTimes.length > 0 ? (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <Clock size={20} className="mr-2 text-blue-600" />
                Available Times
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {showTimes.map(show => (
                  <button
                    key={show.id}
                    className="group relative bg-gradient-to-br from-blue-500 to-blue-400 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
                    onClick={() =>handleSeatEdit(show.id , show.end_time)}
                  >
                    <div className="relative z-10" >
                      <div className="text-lg font-bold">{formatTime(show.start_time)}</div>
                      <div className="text-xs text-blue-100 font-medium">to</div>
                      <div className="text-base font-semibold">{formatTime(show.end_time)}</div>
                    </div>
                    <div className="absolute inset-0 bg-blue-500 transform scale-0 group-hover:scale-100 transition-transform duration-200 rounded-lg origin-bottom-right"></div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-blue-50 p-4 rounded-full mb-4">
                <Clock size={32} className="text-blue-500" />
              </div>
              <p className="text-gray-500 text-lg">No showtimes available</p>
              <p className="text-gray-400 text-sm mt-1">Add a new showtime below</p>
            </div>
          )}
          
          {showAddForm ? (
            <div className="bg-blue-50 p-6 rounded-lg shadow-inner mt-6">
              <h2 className="text-xl font-bold text-gray-700 mb-4">Add New Showtime</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <TimePicker
                      onChange={(value) => setTime(value)}
                      value={time}
                      disableClock={true}
                      format="hh:mm:ss a"
                      className="mb-4"
                    />
                  </div>
        
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Add Showtime
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setShowAddForm(true)}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full hover:shadow-lg transition-all duration-200 flex items-center font-medium"
              >
                <span className="mr-2">+</span> Add New Showtime
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
}

export default Addshowtime
