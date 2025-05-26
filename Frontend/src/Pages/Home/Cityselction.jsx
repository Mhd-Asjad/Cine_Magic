import React , {useEffect, useState} from 'react'
import { MapPin , Locate } from 'lucide-react';
import apiMovies from '@/Axios/Moviesapi';
import { useDispatch } from 'react-redux';
import { setMovies } from '@/Redux/Features/MovieSlice';
import { setLocation , setSelectedCity } from '@/Redux/Features/Location.slice';
function Cityselction({ oncityselect }) {
  
    const [ cities , setCities ] = useState([]);
    const [ loading , setLoading] = useState(true)
    const [ error , setError] = useState('')
    const dispatch = useDispatch();

    const fetchNearestMovies = async(city_ids , lat , lon) => {
      try{
        const res = await apiMovies.get(`/get-multiplecity-movies/?city_ids=${city_ids.join(',')}`)
        const city_id = res.data.map((movie)=> movie.city_id)

        
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        const data = await response.json();
        const currentCity = data.address.city || data.address.town || data.address.village || ''

        dispatch(setSelectedCity(currentCity))
        dispatch(setLocation({
          cityId : city_id ,
          location : currentCity
        })) 
          
          const allMovies = res.data.flatMap(city => city.movies);
          const uniqueMovies =Array.from(new Map(allMovies.map(movie => [movie.id, movie])).values());

          dispatch(setMovies(uniqueMovies))

        if (oncityselect){
          oncityselect(city_id , currentCity)
        }

      }catch(error){  
        console.log(error , 'err while fetching multiple movies')
      }
    }

    const handleDetectLocation = () => {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser.');
        return;
      }

      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await apiMovies.get(`/get-nearest-citys/`, {
            params: { latitude, longitude }
          });

          const city_ids = res.data.map(city => city.city_id);
          console.log(res.data)
          await fetchNearestMovies(city_ids, latitude, longitude);

        } catch (error) {
          console.error('Failed to fetch nearest cities:', error);
        }
      });
    };


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
      <div className="flex items-center justify-center mb-6">
        <MapPin className="text-indigo-600 mr-2" size={24} />
        <h2 className="text-xl md:text-xl font-semibold text-gray-800">Select Location</h2>
      </div>
      <div className='mx-auto flex items-center w-1/2 p-2 mb-4 border ' >

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
