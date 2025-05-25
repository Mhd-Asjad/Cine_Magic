import React , {useEffect, useState} from 'react'
import { MapPin , Locate } from 'lucide-react';
import apiMovies from '@/Axios/Moviesapi';
import { data } from 'react-router-dom';

function Cityselction({ oncityselect }) {
  
    const [ cities , setCities ] = useState([]);
    const [ loading , setLoading] = useState(true)
    const [ error , setError] = useState('')

  

    const handleDetectLocation = () => {
      if (!navigator.geolocation){
        alert('this browser wont allowing locations');
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude , longitude } = position.coords;
          apiMovies.get(`/get-nearest-citys/`, {
              params: { 
                latitude,
                longitude
              }
            })
            .then((response) => {
              const data = response.data;
              const city_ids = data.map((city)=> city.city_id)
              
            })  
            .catch((e) => {
              console.log(e, 'error');
            });
        },
        (err) => {
          setError && setError("Permission denied or error getting location.");
        }
      );
    }

    const fetchCities = async () => {
      try {
          const response = await apiMovies.get('list_cities/');
          
          console.log(response.data.cities ,'cities data')
          setCities(response.data.cities)
      }catch(error){
          console.log("Error fetching cities :",error)
      }finally{
          setLoading(false)
      }
    }

    useEffect(() => {

        fetchCities()

    },[])

    if (error) return <p>{error}</p>;


    if (loading) {
        return <div className='flex justify-center items-center'>Loading...</div>
    }

    return (
      <div >
      <div className='flex justify-center w-[90%] p-2 mb-4 border' >

        <button 
          className='text-md text-blue-500'
          onClick={handleDetectLocation}
        >
          
          
          Detect My location <Locate className='inline' /> 
        
        
        </button>

        <span className='ml-6' >
          helps to find nearst theaters
        </span>

      </div>
      <div className="flex items-center justify-center mb-6">
        <MapPin className="text-indigo-600 mr-2" size={24} />
        <h2 className="text-xl md:text-xl font-semibold text-gray-800">Select Location</h2>
      </div>

      
      {cities.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
          {cities.map((city) => (
            <div key={city.id} className="flex justify-center">
              <button
                onClick={() => oncityselect(city.id)}
                className={`w-full px-3 py-2 rounded-lg border text-sm transition-all md:text-sm md:w-[200px] duration-200'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300`}
              >
                {city.name}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <p className="text-red-500 font-semibold">No Cities Available</p>
            <p className="text-gray-500 mt-2">Please try again later</p>
          </div>
        </div>
      )}
    </div>
    )
}

export default Cityselction
