import apiAdmin from '@/axios/api'
import React, { useEffect , useState } from 'react'
import { ChevronDown, Film, MapPin, User, Info, Check, X , CircleCheckBig , ShieldAlert } from 'lucide-react';

import { toast } from 'sonner';
import { 
    Dialog,     
    DialogContent, 
    DialogTitle, 
  
  
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
function ShowTheatres() {
  const [ theatres , setTheatres ] = useState([])
  const [expandedTheatre, setExpandedTheatre] = useState(null);
  const [expandedScreens, setExpandedScreens] = useState({});
  const [ loading , setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionScreen , setRejectionScreen] = useState(null);

  useEffect(() => {
    fetchTheaters()
  },[expandedScreens])
  const fetchTheaters = async() => {
    try {
      const res = await apiAdmin.get('verified-theatres/')
      setTheatres(res.data)
    }catch(e){
        console.log(e?.response)
    }finally{
      setLoading(false)
    }
  };

  const openRejectModal = (screen_det) => {
    setRejectionScreen(screen_det)
    setShowRejectModal(true)
  } 
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

  const handleApprove = async(screen_id , ownerId) => {
    console.log(screen_id)
    try{
      const res = await apiAdmin.post(`handle-screen/${screen_id}/`,{
        'owner_id' : ownerId,
      })
      toast(res.data.message, {
        icon: <CircleCheckBig className='w-6 h-6 text-green-500' />,
      })
      setExpandedScreens({})
    }catch(e) {
      console.log(e)
    }
  }
  
  const handleToggleStatus = async (screenId) => {
    try {
      const res = await apiAdmin.patch(`toggle-screen-status/${screenId}/`);
      if (res.status === 200) {
        fetchTheaters()
        toast(res.data.message ,{
          icon: <CircleCheckBig className='w-6 h-6 text-green-500' />,
        });
      }
    } catch (error) {
      console.error(error);
      toast('Failed to toggle status', {
        icon: <ShieldAlert className='w-6 h-6 text-red-500' />,
      });
    }
  };

  const toggleTheatreStatus = async(theatre_id) => {
    try {
      const res = await apiAdmin.patch(`toggle-theatre-status/${theatre_id}/`)
          if (res.status === 200) {
        fetchTheaters()
        toast(res.data.message ,{
          icon: <CircleCheckBig className='w-6 h-6 text-green-500' />,
        } );
        }

    }catch(error) {
      console.log(error)
      toast('Failed to toggle status', {
        icon: <ShieldAlert className='w-6 h-6 text-red-500' />,
      });

    }
  }

  const handleDelete = async( owner )=> {
    if (!rejectionReason) {
      toast('provide a reason to reject screeen', {
        icon: <CircleCheckBig className='w-6 h-6 text-red-500' />,
      });
      return
    }
  
      
      try {
        console.log(rejectionReason , 'id ' , owner)
        const res = await apiAdmin.delete(`handle-screen/${rejectionScreen.id}/`, {
          data: {
          rejection_reason: rejectionReason,
          owner_id: owner, 
          }
        })
        console.log(res.data.message)
        if (res.status === 200){

          toast(res.data.message, {
            icon: <CircleCheckBig className='w-6 h-6 text-green-500' />,
          })
          setExpandedScreens({})
          setShowRejectModal(false)
          setRejectionReason("")
        }
        
      }catch(e){
        console.log(e)
      };
  }
  
  if (loading) {
    return (
      <div className='flex justify-center items-center' >Loading.....</div>
    )
  }
  console.log(theatres)
  return (


  <div className="w-full max-w-screen-xl mx-auto">
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
                            <tr>
                              <td className="py-2 font-medium text-gray-600"><strong> Action :</strong> </td>
                              <td className="py-2 text-gray-800">
                                <button
                                  onClick={() => toggleTheatreStatus(theatre.id)}
                                  className={`px-4 py-1 rounded-full text-white text-sm font-semibold 
                                    ${theatre.is_confirmed ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                                >
                                  {theatre.is_confirmed ? 'Deactivate' : 'Activate'}
                                </button>
                              </td>
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
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      !screen.is_approved && screen.rejection_reason
                                        ? 'bg-red-100 text-red-700'
                                        : screen.is_approved && screen.is_active
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}
                                  >
                                   {
                                    !screen.is_approved && screen?.rejection_reason
                                      ? 'Rejected'
                                      : screen.is_approved
                                      ? screen.is_active ? 'Active' : 'Inactive'
                                      : 'Pending Approval'
                                  }
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
                                     <td className="py-2 text-gray-800">{screen.is_active ? 'Active' : 'Inactive'}</td>
                                   </tr>
                                     <tr>
                                       <td className="py-2 font-bold text-gray-600">Action:</td>
                                       {!screen.is_approved ?  (

                                      
                                        <td className="py-2 text-gray-800">
                                          <div className="flex gap-3">
                                            <Button
                                              variant="outline"
                                              size="icon"
                                              onClick={() => handleApprove(screen.id , theatre.owner.id)}
                                            >
                                              <Check className="h-4 w-4 text-green-500" />
                                            </Button>
                                            <Button
                                              variant="outline"
                                              size="icon"
                                              onClick={() => openRejectModal(screen)}
                                            >
                                              <X className="h-4 w-4 text-red-500" />
                                            </Button>
                                          </div>
                                        </td>
                                       ):(
                                        <td className="py-2">
                                          <button
                                            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200 
                                              ${screen.is_active 
                                                ?  'bg-red-100 text-red-700 hover:bg-red-200'
                                                : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                                            onClick={() => handleToggleStatus(screen.id)}
                                          >
                                            {screen.is_active ? 'deactive' : 'activate'}
                                          </button>
                                        </td>
                                       )}
                                     </tr>
                                 </tbody>
                               </table>
                             </div>
                           
                             <div>
                                <p className="text-gray-600 font-medium mb-2">Available seats:</p>
                                <div className="flex flex-col items-center gap-2">
                                  {Object.entries(
                                    screen.seats.reduce((acc, seat) => {
                                      acc[seat.row] = acc[seat.row] || [];
                                      acc[seat.row].push(seat);
                                      return acc;
                                    }, {})
                                  ).map(([row, rowSeats]) => (
                                    <div key={row} className="flex items-center gap-2">
                                      <div className="w-6 font-bold">{row}</div>

                                      <div className="flex gap-2">
                                        {Array.from({ length: parseInt(screen.seat_in_a_row) }).map((_, index) => {
                                          const seat = rowSeats.find(
                                            s => s.number === index + 1
                                          );

                                          if (seat && seat.label && seat.is_active) {
                                            return (
                                              <div
                                                key={seat.id}
                                                className="w-10 h-10 bg-green-500 text-white flex items-center justify-center rounded text-xs"
                                              >
                                                {seat.label}
                                              </div>
                                            );
                                          }

                                          return <div key={index} className="w-10 h-10" />;
                                        })}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
                                  <DialogContent>
                                    <DialogTitle>Reject Screen</DialogTitle>
                                    <div className="space-y-4">
                                      <textarea
                                        className="w-full border border-gray-300 rounded p-2"
                                        rows={4}
                                        value={rejectionReason}
                                        placeholder="Enter reason for rejection..."
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                      ></textarea>

                                      <div className="flex justify-end gap-2">
                                        <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                                          Cancel
                                        </Button>
                                        <Button variant="destructive" onClick={() => handleDelete(theatre.owner.id)}>
                                          Reject
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
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