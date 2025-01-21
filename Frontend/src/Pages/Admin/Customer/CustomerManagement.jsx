import React , {useEffect, useState} from 'react'
import Navbar from '../../../Components/Admin/Navbar'
import Sidebar from '../../../Components/Admin/Sidebar'
import apiAdmin from '../../../Axios/api';
function CustomerManagement() {
  const [users , setUsers ] = useState([]);

  useEffect(()=> {
    fetchUsers()
    
  },[])
  
  const fetchUsers = async () => {
    try {
        const response = await apiAdmin.get('users/' , );
        setUsers(response.data)

    }catch(e) {
      console.log('error user fetching :' , e)

    }
  }
  const toggleUserStatus = async (userId) => {

      try {
        await apiAdmin.post(`users/${userId}/status/`);
        fetchUsers()
      }catch(error) {
        console.error('Error togling user status :',error)
      }
    };
  return (
    <div className='flex min-h-screen bg-gray-100' >
      <div className="w-64 bg-gray-800 text-white">
        <Sidebar />
      </div>

    <div className='flex-1'>
      <Navbar/>

      <div className='p-4 py-20 ' >
        <h1 className='text-2xl font-bold mb-4 flex justify-center' >Customer Management</h1>
        <div className='overflow-x-auto' >
          <table className='table-auto w-full border-collapse border border-gray-300' >

            <thead>

              <tr className='bh-gray-200' >

                <th className='border border-gray-300 px-4 py-2 bg-purple-500'  >Id</th>
                <th className='border border-gray-300 px-4 py-2 bg-purple-500'  >username</th>
                <th className='border border-gray-300 px-4 py-2 bg-purple-500'  >Status</th>
                <th className='border border-gray-300 px-4 py-2 bg-purple-500'  >Action</th>
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
                      
                      <button className={`px-4 py-2 rounded ${
                        user.is_active ? "bg-red-500 text-white hover:bg-red-600" :  "bg-green-500 text-white hover:bg-green-600"
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

    </div>
  )
}

export default CustomerManagement
