import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { DollarSign, Film, Users, MapPin } from "lucide-react";
import { IoIosAddCircleOutline } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import TheatreApi from '@/Axios/theatreapi';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/Components/ui/button';
import EditProfile from './EditProfile';
function TheatreDashboard() {
  
  const theatreOwner = useSelector((state) => state.theatreOwner);
  const {toast} = useToast();
  const navigate = useNavigate()

  const validate_owner = async() => {
    try{
      const res = await TheatreApi.get(`/validate-owner/?owner_id=${theatreOwner.theatreId}`,)
      console.log(res.data.message)
      if (res.status === 200) {
        navigate('/theatre-owner/add-theatre');
      }
    }catch(e) {
      toast({title : e.response.data.error,
          variant :'destructive'

      })
    }

  }
  const stats = [
    { title: "Theatre Status", value: 'pending' || "Not Set", icon: Film },
    { title: "Location", value: theatreOwner.location || "Not Set", icon: MapPin },
    { title: "State", value: theatreOwner.state || "Not Set", icon: MapPin },
  ];
  

  return (
    <div className="p-10 bg-gray-50 ">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{theatreOwner.theatreName || "Theatre Dashboard"}</h1>
          <p className="text-gray-500">Welcome back, Theatre Owner</p>
        </div>
      <EditProfile/>
        <div className='flex mb-2 pb-4 justify-end p-3' >
  
        <button className='flex mb-2 justify-end items-center gap-1 border rounded-md py-1 px-3 border-green-300 font-semibold'
          onClick={validate_owner}
          >
          <IoIosAddCircleOutline className='text-2xl' />
              add Theatre
          </button>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="flex items-center p-6">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500">{stat.title}</p>
                  <h3 className={`text-xl font-bold ${
                    stat.title === "Theatre Status" 
                      ? theatreOwner.ownership_status === "confirmed"
                        ? "text-green-600"
                        : theatreOwner.ownership_status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                      : ""
                  }`}>
                    {stat.value}
                  </h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Theatre Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p><span className="font-semibold">Theatre Name:</span> {theatreOwner.theatreName || "Not Set"}</p>
              <p><span className="font-semibold">Location:</span> {theatreOwner.location || "Not Set"}</p>
              <p><span className="font-semibold">State:</span> {theatreOwner.state || "Not Set"}</p>
              <p><span className="font-semibold">Pincode:</span> {theatreOwner.pincode || "Not Set"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar className="rounded-md border" />
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
  );
}

export default TheatreDashboard;