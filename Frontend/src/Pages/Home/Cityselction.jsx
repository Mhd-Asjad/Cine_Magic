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
            
            console.log(response.data.cities)
            setCities(response.data.cities)
        }catch(error){
            console.log("Error fetching cities :",error)
        }
    }


  return (
    <div  >
        <h2 className='p-4 text-xl font-semibold gap-2'>Add Location</h2>
        <div className='flex gap-2 p-4 space-y-2'>
            {cities.length > 0 ? (

                cities.map((city) => (
                    <button
                        key={city.id}
                        onClick={()=> oncityselect(city.id)}
                        className='text-left px-3 py-2 rounded-md border hover:bg-gray-100'
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
