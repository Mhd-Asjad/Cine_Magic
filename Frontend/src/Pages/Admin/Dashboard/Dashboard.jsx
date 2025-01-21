import React , {useEffect, useState} from 'react'
import Sidebar from '../../../Components/Admin/Sidebar'
import Navbar from '../../../Components/Admin/Navbar'
import apiAdmin from '../../../Axios/api';
import Activeusercard from '../../../Components/Admin/Activeusercard';

function Dashboard() {
  const [activeUserCount , setActiveUsersCount] = useState(0);

  useEffect(() => {
    fetchActiveUser()
  },[])
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
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-gray-800 text-white">
        <Sidebar />
      </div>

      <div className="flex-1">
        <Navbar />

        <div className="p-12">
          <h1 className="mt-10 text-2xl font-bold mb-6">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 w-[70%]">
            <Activeusercard activeUsersCount={activeUserCount} />
          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard
