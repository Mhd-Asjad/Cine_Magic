import axios from 'axios';
import React , {useEffect, useState} from 'react'
import 'toastr/build/toastr.min.css';
import toastr from 'toastr';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { useSelector } from 'react-redux';
import { ToastAction } from '@radix-ui/react-toast';
import TheatreApi from '@/Axios/theatreapi';
import { useNavigate } from 'react-router-dom';
import apiMovies from '@/Axios/Moviesapi';

function AddTheatre( ) {
    const [theatreName , setTheatreName] = useState('');
    const [ address , setAddress ] = useState('');
    const [cities , setCities ] = useState([])
    const [cityId, setCityId] = useState("");
    const {toast} = useToast();
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
            toast({title : 'name and address is requiredd' , variant:"destructive"})
            return;
        }
        if (!cityId){
            toast({description:'choose a city',
                variant :'destructive'
        })
        return
        }

        const theatreData = {
            'owner_id' : owner_id,
            'name' : theatreName,
            'address' : address,
        }
        try {
            const res = await TheatreApi.post(`/theatre/${cityId}/add`,theatreData)
            toast({
                title : res.data.message,
                variant : 'success'
            })
            setTheatreName('')
            setAddress('')
            setCityId("")
            navigate('/theatre-owner/dashboard')
        }catch(e){
            console.log(e.response)
            console.log('error creating theatre' , e.response)
            
            toast({title : e.response?.data?.error ,
                variant : "destructive",
                action: <ToastAction className='flex border border-light font-semibold rounded py-1 pl-1 pr-1' altText="Try again">Try again</ToastAction>,
            }); 
        }
    }

  return (
    <div className='flex border shadow-md mt-10 py-4 bg-gray-100' >
        <div className='p-10 py-8' >
    <h2 className='flex justify-center p-2 font-semibold text-xl' >add Theater</h2>
        <div className='flex flex-col space-y-2'>
            <form onSubmit={handleAddTheatre} >
            <label > theatre name</label>
            <input 
            type="text"
            placeholder='Add Theatre name'
            onChange={(e) => setTheatreName(e.target.value) }
            className="mt-1 mb-7 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />

            <select
                className="w-full px-3 py-2 text-dark border border-gray-300 rounded-md"
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

            <br />

            <input
            type="text"
            placeholder='Add valid address'
            onChange={(e) => setAddress(e.target.value) }
            className="mt-8 mb-6 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"

            />

            <button
            type='submit'
             className='flex mt-4 mx-auto justify-center items-center w-[25%] py-1 px-2 bg-blue-500 text-white font-bold rounded-md' >
              Save
            </button>
            </form>
        </div>
        </div>
    </div>
  )
}

export default AddTheatre
