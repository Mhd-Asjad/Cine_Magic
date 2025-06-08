import React, { useEffect, useState } from 'react'
import Navbar from '../../../components/Admin/Navbar'
import Sidebar from '../../../components/Admin/Sidebar'
import apiAdmin from '../../../Axios/api';
import Button from "@mui/material/Button";
import { useNavigate } from 'react-router-dom';
import { FaListOl } from "react-icons/fa";
import SearchBar from '@/components/search/SearchBar';

function CustomerManagement() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers()

  }, [])

  // navigate to the customer enquery

  const handleClick = () => {
    navigate('/admin/enquery')
  }

  const fetchUsers = async () => {
    try {
      const response = await apiAdmin.get('users/',);
      setUsers(response.data)

    } catch (e) {
      console.log('error user fetching :', e)

    }
  }
  const toggleUserStatus = async (userId) => {

    try {
      await apiAdmin.post(`users/${userId}/status/`);
      fetchUsers()
    } catch (error) {
      console.error('Error togling user status :', error)
    }
  };
  return (

    <div className='flext min-h-screen' >
      <div className='p-8 mt-7' >


        <h1 className='text-2xl font-bold mb-4' >Customer Management</h1>


        <div className='overflow-x-auto' >

          <SearchBar
            placeholder='search by username'

          />
          <div className='flex justify-end mb-4'>
            <Button
              color="primary"
              onClick={handleClick}

            >
              <FaListOl className='text-xl pl-1' />
              Show enquery
            </Button>



          </div>
          <table className='table-auto w-full border-collapse border border-gray-300' >

            <thead>

              <tr className="bg-blue-600 text-white text-left">

                <th className='border border-gray-300 px-4 py-2'  >Id</th>
                <th className='border border-gray-300 px-4 py-2'  >username</th>
                <th className='border border-gray-300 px-4 py-2'  >Status</th>
                <th className='border border-gray-300 px-4 py-2'  >Action</th>
              </tr>

            </thead>
            <tbody>

              {users.map((user) => (
                <tr key={user.id} className='hover:bg-gray-100' >

                  <td className='border border-gray-300 px-4 py-2' >{user.id}</td>
                  <td className='border border-gray-300 px-4 py-2' >{user.username} </td>
                  <td className='border border-gray-300 px-4 py-2' >

                    {user.is_active ? 'Active' : 'Blocked'}
                  </td>
                  <td className='border border-gray-300 px-4 py-2' >

                    <button className={`px-4 py-2 rounded ${user.is_active ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      {user.is_active ? "Block" : "Unblock"}
                    </button>

                  </td>

                </tr>
              ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
export default CustomerManagement