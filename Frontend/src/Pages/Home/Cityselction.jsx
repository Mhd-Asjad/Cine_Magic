import React , {useEffect, useState} from 'react'
import axios from 'axios'
import { MapPin } from 'lucide-react';

function Cityselction({ oncityselect }) {
    const [ cities , setCities ] = useState([]);
    const [ loading , setLoading] = useState(true)
    useEffect(() => {

        fetchCities()
    },[])

    const fetchCities = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/movies/list_cities/');
            
            console.log(response.data.cities ,'cities data')
            setCities(response.data.cities)
        }catch(error){
            console.log("Error fetching cities :",error)
        }finally{
            setLoading(false)
        }
    }

    if (loading) {
        return <div className='flex justify-center items-center'>Loading...</div>
    }

    return (
        <div >
      <div className="flex items-center justify-center mb-6">
        <MapPin className="text-indigo-600 mr-2" size={24} />
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Select Location</h2>
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
