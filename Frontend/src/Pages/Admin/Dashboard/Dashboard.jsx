import React , {useEffect, useState} from 'react'
import Sidebar from '../../../Components/Admin/Sidebar'
import Navbar from '../../../Components/Admin/Navbar'
import apiAdmin from '../../../Axios/api';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
} from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer , Bar , BarChart } from 'recharts';
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { Calendar, Film , User } from "lucide-react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { date } from 'zod';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [theatreStats , setTheatreStats] = useState(null);
  const [filter, setFilter] = useState("month")
  const [chartData, setChartData] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [loading , setLoading] = useState(true)
  const navigate = useNavigate()
  const pad = (n) => n.toString().padStart(2, '0');
  const formatDateWithTime = (date, time = '00:00:00') =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${time}`;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  const today = new Date();
  const [dateRange, setDateRange] = useState({ from: formatDateWithTime(startOfMonth , '00:00:00'), to: formatDateWithTime(today,'23:59:59') });
  const [recentBooking , setRecentBooking] = useState([])
  useEffect(() => {
    fetchRevenueChart()
    fetchRecentBooking()
    fetchDashStats()
  },[filter , dateRange])

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await apiAdmin.get("ticket-trend/",{
          params : {
            'start_date' : dateRange.from,
            'end_date' : dateRange.to,
          }
        })
        
        setChartData(response.data)
        
        
      }catch(error) {
        console.error("Error fetching chart data:", error)
      }
    }
    fetchChartData()
  },[filter , dateRange])

  console.log(chartData);
  

  const fetchRevenueChart = async () =>{
    setLoading(true)
    try {
      const response = await apiAdmin.get("revenue-chart/", {
        params: {
          period: filter,
          start_date: dateRange.from,
          end_date: dateRange.to,
        }
      });
      setRevenueData(response.data);
    } catch (error) {
      console.error("Error fetching revenue chart data:", error);
    }finally {
      setLoading(false)
    }
  }
 
  console.log(revenueData , 'date range')

  const fetchRecentBooking = async() => {
    try {
      const res = await apiAdmin.get('recent-sales/')
      console.log(res.data)
      setRecentBooking(res.data)
    }catch(e){
      console.log(e , 'error from recent booking')
    }
  }

  const fetchDashStats = async() =>  {
    try {
      const res = await apiAdmin.get('dashboard_view/')
      console.log(res.data)
      setTheatreStats(res.data)
    }catch(e){
      console.log(e , 'error from card section')
    }finally {
      setLoading(false)
    }
  }

  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };
  console.log(revenueData , 'revenue stats')

  const handleReportDownload = () => {
    navigate('/admin/download/reports')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }
  return (

  <div className="w-full max-w-screen-xl mx-auto mt-8">

      <div className="flex items-center justify-between w-full max-w-7xl mb-2 mt-2"> 


        <h1 className="text-3xl font-bold mt-8 mb-4 items">Dashboard</h1>
          <div className="flex items-center space-x-2 bg-white px-4 py-2 mt-3 rounded-lg border shadow-sm">
            <span className='font-semibold' >

            filter by date 
            </span>
              <Calendar className="h-4 w-4 text-gray-500" /> :
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => handleDateRangeChange('from', e.target.value)}
                className="border-none outline-none text-sm"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => handleDateRangeChange('to', e.target.value)}
                className="border-none outline-none text-sm"
                />
          </div>
            <div>
              
                  <button
                    onClick={handleReportDownload}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
                  >
        
                    download report
                  </button>

            </div>

      </div>

          

      <div className="grid grid-cols-1 lg:col-span-3 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        
        {/* Total Revenue */}


        <div >

        </div>
        <Card className="w-full">
          <CardContent className="pt-6 text-left ml-2">
            <div className="text-sm text-gray-500 mb-1 flex items-center">
              Total theatre amount <span className="ml-2">₹</span>
            </div>
            <div className="text-2xl font-bold">₹ {revenueData[0]?.total_revenue ? revenueData[0].total_revenue : 0}</div>
            <div className="text-xs text-green-500 mt-1"> {theatreStats?.revenue_change}% + from last month</div>
          </CardContent>
        </Card>

        {/* Users */}
        <Card className="w-full">
          <CardContent className="pt-6 text-left ml-2">
            <div className="text-sm text-gray-500 mb-1 flex items-center">
              Users <span className="ml-2"><User size={16} /></span>
            </div>
            <div className="text-2xl font-bold">+{theatreStats?.active_users.toLocaleString()}</div>
          </CardContent>
        </Card>

        {/* Ticket Sold */}
        <Card className="w-full">
          <CardContent className="pt-6 text-left ml-2">
            <div className="text-sm text-gray-500 mb-1 flex items-center">
              Total Tickets Sold <span className="ml-2">🎟️</span>
            </div>
            <div className="text-2xl font-bold">+{theatreStats?.total_tickets}</div>
            <div className="text-xs text-green-500 mt-1">{theatreStats?.ticket_change}% + from last month</div>
          </CardContent>
        </Card>

        {/* Active Now */}
        <Card className="w-full">
          <CardContent className="pt-6 text-left ml-2">
            <div className="text-sm text-gray-500 mb-1 flex items-center">
              Active Now <span className="ml-2">⚡</span>
            </div>
            <div className="text-2xl font-bold">+{theatreStats?.active_theatres}</div>
          </CardContent>
        </Card>


        {/* Tickets Sold Chart */}
        <Card className="lg:col-span-10 w-full" >

        <CardHeader>
            <CardTitle>Tickets Sold Trend</CardTitle>

            
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [value, 'Tickets']} />
                <Line 
                  type="monotone" 
                  dataKey="tickets" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>

          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Sales
              <span className="text-sm font-normal text-gray-500">recent sold tickets</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBooking.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{sale.customer}</p>
                      <p className="text-sm text-gray-500">{sale.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Film className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{sale.movie} • {sale.theatre}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">+₹{sale.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{sale.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card className="lg:col-span-10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Revenue Overview</span>
               <div className="mb-4 flex justify-end gap-2">
                <button
                  onClick={() => setFilter("week")}
                  className={`px-4 py-2 rounded ${filter === "week" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                  Week
                </button>
                <button
                  onClick={() => setFilter("month")}
                  className={`px-4 py-2 rounded ${filter === "month" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                  Month
                </button>
                <button
                  onClick={() => setFilter("year")}
                  className={`px-4 py-2 rounded ${filter === "year" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                  Year
                </button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [`₹${value}`, 'admin revenue']}
                  labelStyle={{ color: '#374151' }}
                />
                <Bar dataKey="admin_revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
    
      
      
      </div>

    </div>

  );
};

export default Dashboard
