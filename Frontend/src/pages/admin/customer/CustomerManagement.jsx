import React, { useEffect, useState } from 'react'
import Navbar from '../../../components/admin/Navbar'
import Sidebar from '../../../components/admin/Sidebar'
import apiAdmin from '../../../axios/api';
import Button from "@mui/material/Button";
import { useNavigate } from 'react-router-dom';
import { FaListOl, FaSearch, FaUser, FaUserCheck, FaUserSlash } from "react-icons/fa";
import SearchBar from '@/components/search/SearchBar';

function CustomerManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [processingUserId, setProcessingUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toString().includes(searchTerm)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleClick = () => {
    navigate('/admin/enquery');
  };

  const fetchUsers = async () => {
    try {
      const response = await apiAdmin.get('users/');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (e) {
      console.log('error user fetching :', e);
    }
  };

  const toggleUserStatus = async (userId) => {
    setProcessingUserId(userId);
    try {
      await apiAdmin.post(`users/${userId}/status/`);
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user status :', error);
    } finally {
      setProcessingUserId(null);
    }
  };

  const StatusBadge = ({ isActive }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isActive 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {isActive ? (
        <>
          <FaUserCheck className="w-3 h-3 mr-1" />
          Active
        </>
      ) : (
        <>
          <FaUserSlash className="w-3 h-3 mr-1" />
          Blocked
        </>
      )}
    </span>
  );

  const ActionButton = ({ user }) => (
    <button
      onClick={() => toggleUserStatus(user.id)}
      disabled={processingUserId === user.id}
      className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        user.is_active
          ? 'text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500'
          : 'text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500'
      } ${processingUserId === user.id ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {processingUserId === user.id ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        <>
          {user.is_active ? (
            <>
              <FaUserSlash className="w-3 h-3 mr-1" />
              Block
            </>
          ) : (
            <>
              <FaUserCheck className="w-3 h-3 mr-1" />
              Unblock
            </>
          )}
        </>
      )}
    </button>
  );

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <div className='flex-1 p-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2 mt-10'>Customer Management</h1>
            <p className='text-gray-600'>Manage customer accounts and their status</p>
          </div>

          <div className='mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center'>
            <div className='relative flex-1 max-w-md'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaSearch className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='text'
                placeholder='Search by username or ID...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleClick}
              startIcon={<FaListOl />}
              className='whitespace-nowrap'
            >
              Show Enquiry
            </Button>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <FaUser className='h-8 w-8 text-blue-500' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>Total Users</p>
                  <p className='text-2xl font-semibold text-gray-900'>{users.length}</p>
                </div>
              </div>
            </div>
            
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <FaUserCheck className='h-8 w-8 text-green-500' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>Active Users</p>
                  <p className='text-2xl font-semibold text-gray-900'>
                    {users.filter(user => user.is_active).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <FaUserSlash className='h-8 w-8 text-red-500' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>Blocked Users</p>
                  <p className='text-2xl font-semibold text-gray-900'>
                    {users.filter(user => !user.is_active).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      User ID
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Username
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {isLoading ? (
                    <tr>
                      <td colSpan="4" className='px-6 py-8 text-center'>
                        <div className='flex items-center justify-center'>
                          <svg className="animate-spin h-5 w-5 text-gray-400 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className='text-gray-500'>Loading users...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr key={user.id} className='hover:bg-gray-50 transition-colors'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          #{user.id}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <div className='flex-shrink-0 h-8 w-8'>
                              <div className='h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center'>
                                <span className='text-sm font-medium text-white'>
                                  {user.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className='ml-4'>
                              <div className='text-sm font-medium text-gray-900'>
                                {user.username}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <StatusBadge isActive={user.is_active} />
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                          <ActionButton user={user} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className='px-6 py-8 text-center'>
                        <div className='text-gray-500'>
                          {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {filteredUsers.length > 0 && (
            <div className='mt-4 text-sm text-gray-600'>
              Showing {filteredUsers.length} of {users.length} users
              {searchTerm && ` for "${searchTerm}"`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerManagement;