import React , {useEffect, useState} from 'react'
import axios from 'axios'
function Cityselction({ oncityselect }) {
    const [ cities , setCities ] = useState([]);

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
        }
    }

    
  return (
    <div  >
        <h2 className='p-4 text-xl font-semibold gap- text-center'>Add Location</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 z-40">
        {cities.length > 0 ? (

                cities.map((city) => (
                    <button
                        key={city.id}
                        onClick={()=> oncityselect(city.id)}
                        className="px-4 py-2 rounded-md border bg-gray-50 mx-auto hover:bg-gray-100 "
                        style={{ fontSize: 'clamp(0.6rem, 1.5vw, 1rem)' }}

                    >
                        {city.name}
                    </button>
                ))
            ) : (
                <p className='mx-auto mt-5 text-red-500 font-bold'>No Cities Available</p>
            )}
        </div>
    </div>
  )
}

export default Cityselction
