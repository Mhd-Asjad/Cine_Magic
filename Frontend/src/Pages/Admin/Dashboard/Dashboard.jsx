import React , {useEffect, useState} from 'react'
import Sidebar from '../../../Components/Admin/Sidebar'
import Navbar from '../../../Components/Admin/Navbar'
import apiAdmin from '../../../Axios/api';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip 
} from "recharts";
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import DatePicker from './DatePicker';
import { Calendar, User } from "lucide-react";

function Dashboard() {

  const mockRevenueData = [
    { month: "Jan", revenue: 3200 },
    { month: "Feb", revenue: 2700 },
    { month: "Mar", revenue: 4600 },
    { month: "Apr", revenue: 5100 },
    { month: "May", revenue: 3100 },
    { month: "Jun", revenue: 4300 },
    { month: "Jul", revenue: 2600 },
    { month: "Aug", revenue: 4500 },
    { month: "Sep", revenue: 3200 },
    { month: "Oct", revenue: 5300 },
    { month: "Nov", revenue: 4400 },
    { month: "Dec", revenue: 2300 }
  ];

  const [activeUserCount , setActiveUsersCount] = useState(0);
  const [ ticketSold , setTicketSold] = useState(0)
  const [ totalAmount , setTotalAmount] = useState(0)
  const [activeTheater , setActiveTheater ] = useState(0)
  useEffect(() => {
    fetchActiveUser()
    totalTicketSold()
    activeTheatres()
  },[])

  const activeTheatres = async() => {
    try {
      const res = await apiAdmin.get('verified-theatres/')
      setActiveTheater(res.data.length)
    }catch(e) {
      console.log(e)
    }
  }
  const totalTicketSold = async() =>  {
    try {
      const res = await apiAdmin.get('ticket-sold/')
      console.log(res.data)
      const { bookings , total_amount} = res.data
      setTicketSold(bookings)
      setTotalAmount(total_amount)
    }catch(e){
      console.log(e , 'error from card section')
    }
  }

  const fetchActiveUser = async () =>  {

    try {
      const response = await apiAdmin.get('users/');
      const activeCount = response.data.filter(user => user.is_active).length;
      console.log(activeCount)
      setActiveUsersCount(activeCount)
    }catch(error) {
      console.log('Error fetching active user count :',error)
    }
  };
      return (
    <div className="flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-3xl font-bold mt-8 mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        
        {/* Total Revenue */}
        <Card className="w-full">
          <CardContent className="pt-6 text-left ml-2">
            <div className="text-sm text-gray-500 mb-1 flex items-center">
              Total Revenue <span className="ml-2">$</span>
            </div>
            <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
            <div className="text-xs text-green-500 mt-1">+ from last month</div>
          </CardContent>
        </Card>

        {/* Users */}
        <Card className="w-full">
          <CardContent className="pt-6 text-left ml-2">
            <div className="text-sm text-gray-500 mb-1 flex items-center">
              Users <span className="ml-2"><User size={16} /></span>
            </div>
            <div className="text-2xl font-bold">+{activeUserCount.toLocaleString()}</div>
            <div className="text-xs text-green-500 mt-1">+ from last month</div>
          </CardContent>
        </Card>

        {/* Ticket Sold */}
        <Card className="w-full">
          <CardContent className="pt-6 text-left ml-2">
            <div className="text-sm text-gray-500 mb-1 flex items-center">
              Total Tickets Sold <span className="ml-2">🎟️</span>
            </div>
            <div className="text-2xl font-bold">+{ticketSold}</div>
            <div className="text-xs text-green-500 mt-1">+ from last month</div>
          </CardContent>
        </Card>

        {/* Active Now */}
        <Card className="w-full">
          <CardContent className="pt-6 text-left ml-2">
            <div className="text-sm text-gray-500 mb-1 flex items-center">
              Active Now <span className="ml-2">⚡</span>
            </div>
            <div className="text-2xl font-bold">+{activeTheater}</div>
            <div className="text-xs text-green-500 mt-1">+ since last hour</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid mt-8 lg:grid-cols-2">
        <ChartAreaInteractive/>

      </div>
    </div>
  );
};

export default Dashboard
