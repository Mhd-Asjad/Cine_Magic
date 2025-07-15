import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TheatreApi from '@/axios/theatreapi';
import { toast } from 'sonner';
import { CircleCheckBig , CircleAlert } from 'lucide-react';
function EditShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    movieId: '',
    screenId: '',
    slotId: ''
  });
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showDetails, setShowDetails] = useState({
    movieTitle: '',
    screenNumber: '',
    theatreName: ''
  });

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        setLoading(true);
        const res = await TheatreApi.get(`/edit-show/${id}/`);
        const data = res.data;
        
        setFormData({
          startDate: data.start_date || '',
          endDate: data.end_date || '',
          startTime: data.show_time ? data.show_time.substring(0, 5) : '', // Remove seconds
          endTime: data.end_time ? data.end_time.substring(0, 5) : '',
          movieId: data.movie || '',
          screenId: data.screen || '',
          slotId: data.slot || ''
        });
        
        setShowDetails({
          movieTitle: data.movie_title || '',
          screenNumber: data.screen_number || '',
          theatreName: data.theatre_name || ''
        });
        
      } catch (error) {
        console.error('Show fetching error:', error);
        toast(
          "Failed to fetch show details",{
          icon: <CircleAlert className="w-6 h-6 text-yellow-500" />,
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchShowDetails();
    }
  }, [id, toast]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const { startDate, endDate, startTime, endTime } = formData;
    
    if (!startDate || !endDate || !startTime) {
      toast(
       'Please fill in all required fields',{
        icon: <CircleAlert className="w-6 h-6 text-yellow-500" />,
        style: {
          backgroundColor: '#fff3cd', 
        }
      });
      return false;
    }
    
    if (new Date(endDate) < new Date(startDate)) {
      toast(
       'End date cannot be before start date',{
        icon: <CircleAlert className="w-6 h-6 text-yellow-500" />,
        style: {
          backgroundColor: '#fff3cd',
        },
       });
      return false;
    }
    
    if (endTime && startTime >= endTime) {
      toast(
        'End time must be after start time',{
        icon: <CircleAlert className="w-6 h-6 text-yellow-500" />,
        style: {
          backgroundColor: '#fff3cd',
        },
        });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      const payload = {
        start_time: formData.startTime,
        end_time: formData.endTime || null,
        show_date: formData.startDate,
        end_date: formData.endDate,
        screen: formData.screenId,
        movie: formData.movieId,
        slot: formData.slotId,
      };

      const res = await TheatreApi.put(`/edit-show/${id}/`, payload);

      if (res.status === 200) {
        toast(
          'Show details updated successfully',{
            icon: <CircleCheckBig className="w-6 h-6 text-green-500" />,
            style: {
              backgroundColor: '#f0f9ff',
              color: '#0369a1',
            },
          });
        
        // Optional: Navigate back or to show list
        // navigate('/shows');
      }
    } catch (err) {
      console.error('Backend error:', err?.response?.data);
      
      const errorMessage = err?.response?.data?.Error || err?.response?.data?.error || 'Failed to update show details';
      
      toast(
        errorMessage,
        {
          icon: <CircleAlert className="w-6 h-6 text-red-500" />,
          style: {
            backgroundColor: '#fef2f2',
            color: '#b91c1c',
          },
        });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 mt-[18%] flex justify-center">
        <div className="text-lg">Loading show details...</div>
      </div>
    );
  }

  return (
    <div className='p-8 shadow-md mt-[18%] bg-gray-100 max-w-4xl mx-auto rounded-lg'>
      <h2 className='text-2xl font-semibold mb-4 text-center'>Edit Show Details</h2>
      
      {/* Show Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">Current Show Information</h3>
        <p><strong>Movie:</strong> {showDetails.movieTitle}</p>
        <p><strong>Theatre:</strong> {showDetails.theatreName}</p>
        <p><strong>Screen:</strong> {showDetails.screenNumber}</p>
      </div>

      <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <label className='block mb-2 font-medium'>Show Start Date *</label>
          <input 
            type="date"
            className='w-full border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            required
          />
        </div>

        <div>
          <label className='block mb-2 font-medium'>Show End Date *</label>
          <input 
            type="date"
            className='w-full border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={formData.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            min={formData.startDate}
            required
          />
        </div>

        <div>
          <label className='block mb-2 font-medium'>Start Time *</label>
          <input 
            type="time"
            className='w-full border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={formData.startTime}
            onChange={(e) => handleInputChange('startTime', e.target.value)}
            required
          />
        </div>

        <div>
          <label className='block mb-2 font-medium'>End Time (Optional)</label>
          <input 
            type="time"
            className='w-full border-gray-300 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={formData.endTime}
            onChange={(e) => handleInputChange('endTime', e.target.value)}
            min={formData.startTime}
          />
          <small className="text-gray-600 mt-1 block">
            Leave empty to use movie duration
          </small>
        </div>

        <div className="col-span-2 flex gap-4 justify-center mt-4">
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className='bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors'
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={submitting}
            className='bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {submitting ? 'Updating...' : 'Update Show'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditShow;
