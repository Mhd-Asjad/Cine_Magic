import React , {useEffect, useState} from 'react'
import 'toastr/build/toastr.min.css';
import toastr from 'toastr';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import TheatreApi from '@/axios/theatreapi';
import { useNavigate } from 'react-router-dom';
import apiMovies from '@/axios/Moviesapi';
import { ShieldAlert , CircleCheckBig } from 'lucide-react';
import InputField from '@/components/InputField'; 
function AddTheatre( ) {
    const [theatreName , setTheatreName] = useState('');
    const [ address , setAddress ] = useState('');
    const [cities , setCities ] = useState([])
    const [cityId, setCityId] = useState("");
    const navigate = useNavigate()
    const owner_id = useSelector((state) => state.theatreOwner.theatreId)
    console.log(owner_id)
    toastr.options = {
        positionClass : 'toast-left-center',
        hideDuration : 3000,
        timeOut : 3000,
        closeButton : true
    }
    useEffect(() => {
        fetchCities()
    },[])


    const fetchCities = async() => {
        try{

            const res = await apiMovies.get('fetchall-citys/');
            setCities(res.data)


        }catch(e){
            console.log(e.response , 'error finding in the cities')
        }

    }
    useEffect(() => {
        console.log("Selected City ID:", typeof(cityId));
    }, [cityId]);
    const handleAddTheatre = async (e) => {
        e.preventDefault()
        if (!theatreName || !address) {
            toast('name and address is requiredd' ,{
                icon: <ShieldAlert size={20} className='text-red-500'/>
            })
            return;
        }
        if (!cityId){
            toast('choose a city',{
                icon: <ShieldAlert size={20} className='text-red-500'/>
            })
        return
        }

        const theatreData = {
            'owner_id' : owner_id,
            'name' : theatreName,
            'address' : address,
        }
        try {
            const res = await TheatreApi.post(`/theatre/${cityId}/add/`,theatreData)
            toast(res.data.message,{
                icon: <CircleCheckBig className="w-6 h-6 text-green-500" />,
                style: {
                    backgroundColor: '#f0f9ff',
                    color: '#0369a1',
                }
            }
            )
            setTheatreName('')
            setAddress('')
            setCityId("")
            navigate('/theatre-owner/dashboard')
        }catch(e){
            console.log(e.response)
            console.log('error creating theatre' , e.response)
            
            toast( e.response?.data?.error ,{
                icon: <ShieldAlert size={20} className='text-red-500'/>,
                style: {
                    backgroundColor: '#fef2f2',
                    color: '#b91c1c',
                }
            }); 
        }
    }

  return (
    <div className="flex justify-center items-start mt-16">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border">
        <h2 className="text-center text-2xl font-semibold text-gray-700 mb-6">Add Theatre</h2>
        <form onSubmit={handleAddTheatre} className="space-y-4">
          <InputField
            label="Theatre Name"
            value={theatreName}
            onChange={(e) => setTheatreName(e.target.value)}
            placeholder="Enter theatre name"
          />

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <InputField
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter valid address"
          />

          <div className="text-center">
            <button
              type="submit"
              className="w-32 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTheatre
