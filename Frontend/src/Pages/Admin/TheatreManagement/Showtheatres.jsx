import apiAdmin from '@/Axios/api'
import React, { useEffect , useState } from 'react'
import { ChevronDown, Film, MapPin, User, Info, Check, X } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import Swal from 'sweetalert2';
import { useToast } from '@/hooks/use-toast';

function ShowTheatres() {
  const [ theatres , setTheatres ] = useState([])
  const [expandedTheatre, setExpandedTheatre] = useState(null);
  const [expandedScreens, setExpandedScreens] = useState({});
  const {toast} = useToast();

  useEffect(() => {
    const fetchTheaters = async() => {
      try {
        const res = await apiAdmin.get('verified-theatres/')
        setTheatres(res.data)
      }catch(e){
          console.log(e?.response)
      }
    };
    fetchTheaters()
  },[expandedScreens])
  console.log(theatres , 'adfjksjl')

  const toggleTheatreExpansion = (theatreId) => {
    setExpandedTheatre(expandedTheatre === theatreId ? null : theatreId);
    if (expandedTheatre === theatreId) {
      setExpandedScreens({});
    }
  };
  const toggleScreenExpansion = (screenId) => {
    setExpandedScreens(prev => ({
      ...prev,
      [screenId]: !prev[screenId]
    }));
  };
  console.log(expandedScreens , 'expanded')

  const handleApprove = async(screen_id) => {
    console.log(screen_id)
    try{
      const res = await apiAdmin.post(`handle-screen/${screen_id}/`)
      toast({title : res.data.message})
      setExpandedScreens({})
    }catch(e) {
      console.log(e)
    }
  }
  

  const handleDelete = async(screen_id )=> {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }); 
    if (result.isConfirmed) {
      try {
        const res = await apiAdmin.delete(`handle-screen/${screen_id}/`)
        console.log(res.data.message)
        if (res.status === 200){

          toast({title : res.data.message})
          setExpandedScreens({})

        }
      }catch(e){
        console.log(e)
      };
    };
  }
  

  return (


    <div className="mb-6">
    <h2 className="text-lg font-medium text-gray-700 mb-3">Active Theatres</h2>
    <div className="space-y-2">

      <div className="bg-gray-100 min-h-screen p-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-800 text-white p-4 rounded-t-lg">
            <h1 className="text-xl font-semibold">Active Theatres</h1>
          </div>

          {theatres.map((theatre) => (
            <div key={theatre.id} className="bg-white w-[1000px] rounded-lg shadow-sm mb-4 overflow-hidden">
              <div 
                className={`flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 ${
                  expandedTheatre === theatre.id ? 'border-l-4 border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => toggleTheatreExpansion(theatre.id)}
              >
                <div className="flex items-center space-x-3">
                  <Film className="text-gray-500" size={20} />
                  <h3 className="font-medium text-gray-800">{theatre.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    theatre.is_confirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {theatre.is_confirmed ? 'Confirmed' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">
                    <MapPin className="inline mr-1" size={16} /> {theatre.city.name}, {theatre.city.state}
                  </span>
                  <ChevronDown 
                    className={`text-gray-400 w-5 h-5 transition-transform ${
                      expandedTheatre === theatre.id ? 'transform rotate-180' : ''
                    }`} 
                  />
                </div>
              </div>
              
              {expandedTheatre === theatre.id && (
                <div className="border-t border-gray-100">
                  <div className="p-4 bg-gray-50">
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                      <Info size={16} className="mr-2" /> Theatre Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <table className="w-full text-sm">
                          <tbody>
                            <tr>
                              <td className="py-2 font-medium text-gray-600">Theatre ID:</td>
                              <td className="py-2 text-gray-800">{theatre.id}</td>
                            </tr>
                            <tr>
                              <td className="py-2 font-medium text-gray-600">Address:</td>
                              <td className="py-2 text-gray-800">{theatre.address}</td>
                            </tr>
                            <tr>
                              <td className="py-2 font-medium text-gray-600">City:</td>
                              <td className="py-2 text-gray-800">{theatre.city.name}</td>
                            </tr>
                            <tr>
                              <td className="py-2 font-medium text-gray-600">Pincode:</td>
                              <td className="py-2 text-gray-800">{theatre.city.pincode}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <table className="w-full text-sm">
                          <tbody>
                            <tr>
                              <td className="py-2 font-medium text-gray-600">State:</td>
                              <td className="py-2 text-gray-800">{theatre.city.state}</td>
                            </tr>
                            <tr>
                              <td className="py-2 font-medium text-gray-600">Has Screens:</td>
                              <td className="py-2">
                                {theatre.has_screen ? 
                                  <Check className="text-green-500" size={18} /> : 
                                  <X className="text-red-500" size={18} />
                                }
                              </td>
                            </tr>
                            <tr>
                              <td className="py-2 font-medium text-gray-600">Status:</td>
                              <td className="py-2 text-gray-800">{theatre.is_confirmed ? 'Confirmed' : 'Pending'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-100">
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                      <User size={16} className="mr-2" /> Owner Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <table className="w-full text-sm">
                        <tbody>
                          <tr>
                            <td className="py-2 font-medium text-gray-600">Username:</td>
                            <td className="py-2 text-gray-800">{theatre.owner.user_name}</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium text-gray-600">Theatre Name:</td>
                            <td className="py-2 text-gray-800">{theatre.owner.theatre_name}</td>
                          </tr>
                        </tbody>
                      </table>
                      <table className="w-full text-sm">
                        <tbody>
                          <tr>
                            <td className="py-2 font-medium text-gray-600">Location:</td>
                            <td className="py-2 text-gray-800">{theatre.owner.location}</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium text-gray-600">Pincode:</td>
                            <td className="py-2 text-gray-800">{theatre.owner.pincode}</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium text-gray-600">Ownership:</td>
                            <td className="py-2 text-gray-800">{theatre.owner.ownership_status}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-100">
                    <h4 className="font-medium text-gray-700 mb-2">Screens </h4>
                    
                    {theatre.screens.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No screens available for this theatre.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {theatre.screens.map((screen) => (
                          <div key={screen.id} className="border border-gray-200 rounded-md">
                            <div 
                              className={`flex justify-between items-center p-3 cursor-pointer ${
                                expandedScreens[screen.id] ? 'bg-gray-50' : ''
                              }`}
                              onClick={() => toggleScreenExpansion(screen.id)}
                            >
                              <div className="flex items-center space-x-3">
                                <span className="font-medium">Screen {screen.screen_number}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  screen.is_approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {screen.is_approved ? 'Active' : 'Inactive'}
                                </span>
                              </div>

                              <div  >
                                <span className='pl-[100%]' ></span>
                              </div>
                              <ChevronDown 
                                className={`text-gray-400 w-4 h-4 transition-transform ${
                                  expandedScreens[screen.id] ? 'transform rotate-180' : ''
                                }`} 
                              />
                            </div>
                            
                            {expandedScreens[screen.id] && (
                             <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 border-t border-gray-200">
                             {/* Left Side: Details */}
                             <div>
                               <table className="w-full text-sm">
                                 <tbody>
                                   <tr>
                                     <td className="py-2 font-medium text-gray-600">Capacity:</td>
                                     <td className="py-2 text-gray-800">{screen.capacity} seats</td>
                                   </tr>
                                   <tr>
                                     <td className="py-2 font-medium text-gray-600">Type:</td>
                                     <td className="py-2 text-gray-800">{screen.screen_type}</td>
                                   </tr>
                                   <tr>
                                     <td className="py-2 font-medium text-gray-600">Status:</td>
                                     <td className="py-2 text-gray-800">{screen.is_approved ? 'Active' : 'Inactive'}</td>
                                   </tr>
                                   {!screen.is_approved && (
                                     <tr>
                                       <td className="py-2 font-bold text-gray-600">Action:</td>
                                       <td className="py-2 text-gray-800">
                                         <div className="flex gap-3">
                                           <Button
                                             variant="outline"
                                             size="icon"
                                             onClick={() => handleApprove(screen.id)}
                                           >
                                             <Check className="h-4 w-4 text-green-500" />
                                           </Button>
                                           <Button
                                             variant="outline"
                                             size="icon"
                                             onClick={() => handleDelete(screen.id)}
                                           >
                                             <X className="h-4 w-4 text-red-500" />
                                           </Button>
                                         </div>
                                       </td>
                                     </tr>
                                   )}
                                 </tbody>
                               </table>
                             </div>
                           
                             <div>
                               <p className="text-gray-600 font-medium mb-2">Available seats:</p>
                               <div className="flex flex-wrap gap-2">
                                 {screen.seats.map((seat) => (
                                   seat?.label ? (
                                     <div 
                                       key={seat.id}
                                       className="w-10 h-10 bg-green-500 text-white flex items-center justify-center rounded text-xs"
                                     >
                                       {seat.label}

                                     </div>
                                   ) : (
                                     <div key={seat.id} className="w-10 h-10" />
                                   )
                                 ))}
                               </div>
                             </div>
                           </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};
export default ShowTheatres