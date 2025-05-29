import TheatreApi from '@/Axios/theatreapi';
import { useToast } from '@/hooks/use-toast';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { error } from 'toastr';

function EditShow() {
  const { id } = useParams();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [ movieId , setMovieId ] = useState('')
  const [ screenId , setScreenId ] = useState('')
  const [ slotId , setSlotId ] = useState('')
  const {toast} = useToast();

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const res = await TheatreApi.get(`/edit-show/${id}/`);
        const { start_date, end_date, show_time, end_time , movie , screen , slot } = res.data;
        setStartDate(start_date);
        setEndDate(end_date);
        setStartTime(show_time);
        setEndTime(end_time);
        setMovieId(movie)
        setScreenId(screen)
        setSlotId(slot)
      } catch (e) {
        console.log(e.response, 'Show fetching error');
      }
    };
    fetchShowDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await TheatreApi.put(`/edit-show/${id}/`, {
        start_time: startTime.length === 5 ? startTime + ':00' : startTime,
        end_time: endTime.length === 5 ? endTime + ':00' : endTime,
        show_date: startDate,
        end_date: endDate,
        screen: screenId,
        movie: movieId,
        slot: slotId,
      });


  
      if (res.status === 200) {
        alert('Show data updated successfully');
      }
    } catch (err) {
      console.log('Backend error:', err?.response?.data); 
  
      toast({
        title: err?.response?.data?.Error || 'Unexpected backend error',
        variant: 'destructive',
      });
    }
  };
  return (
    <div className='p-8 shadow-md mt-[18%] bg-gray-100'>
      <h2 className='text-xl font-semibold mt-2 flex justify-center'>Edit Show Details</h2>

      <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 justify-center items-center'>

        <div>
          <label className='block mb-1'>Show Start Date</label>
          <input type="date"
            className='w-full border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className='block mb-1'>Show End Date</label>
          <input type="date"
            className='w-full border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div>
          <label className='block mb-1'>Start Time</label>
          <input type="time"
            className='w-full border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300'
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div>
          <label className='block mb-1'>End Time</label>
          <input type="time"
            className='w-full border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-blue-300'
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <button className='col-span-2 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600'>
          Update Show
        </button>

      </form>
    </div>
  )
}

export default EditShow;
