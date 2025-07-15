import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { IoIosAddCircleOutline } from "react-icons/io";
import Modal from '../../../components/modals/Modal';
import Addcity from '@/pages/admin/citymanagement/Addcity';
import { MdDelete, MdTheaters, MdLocationPin } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TheatreApi from '@/axios/theatreapi';
import { CiEdit } from "react-icons/ci";
import { FaSearch, FaEye, FaMapMarkerAlt } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import Swal from "sweetalert2";
import ConfirmDialog from '@/components/ConfirmDialog';

function ListTheatre() {
  const [theatres, setTheatre] = useState([]);
  const [filteredTheatres, setFilteredTheatres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  
  const navigate = useNavigate();
  const theatre_owner_id = useSelector((state) => state.theatreOwner.theatreId);

  useEffect(() => {
    VerifiedTheatre();
  }, []);

  // Filter theatres based on search and status
  useEffect(() => {
    let filtered = theatres;

    // Apply search filter
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(theatre =>
        theatre.theatre_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theatre.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theatre.pincode.toString().includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(theatre => {
        if (statusFilter === 'active') return theatre.is_confirmed;
        if (statusFilter === 'inactive') return !theatre.is_confirmed;
        return true;
      });
    }

    setFilteredTheatres(filtered);
  }, [searchTerm, statusFilter, theatres]);

  const VerifiedTheatre = async () => {
    setIsLoading(true);
    try {
      const response = await TheatreApi.get(`/show-available/?owner_id=${theatre_owner_id}`);
      setTheatre(response.data.available_theatre);
      setFilteredTheatres(response.data.available_theatre);
    } catch (e) {
      console.log('Error while fetching theatres ', e);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCity = async (theatre_id) => {
      setProcessingId(theatre_id);
      try {
        const res = await TheatreApi.delete(`/theatre/${theatre_id}/delete/`);
        console.log(res.data)
        VerifiedTheatre()
        console.log(res)
        Swal.fire({
          title: "Deleted!",
          text: "Theatre has been deleted successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false
        });
      } catch (e) {
        console.log('error found deleting theatre', e);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete theatre. Please try again.",
          icon: "error"
        });
      } finally {
        setProcessingId(null);
      }
  };

  const handleEdit = (theatre_id) => {
    navigate(`/theatre-owner/${theatre_id}/edit-theatre`);
  };

  const handleShowScreen = (theatre_id) => {
    navigate(`/theatre-owner/${theatre_id}/screens`);
  };

  const StatusBadge = ({ isConfirmed }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isConfirmed 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {isConfirmed ? 'Active' : 'Inactive'}
    </span>
  );

  const FilterButton = ({ filter, label, count }) => (
    <button
      onClick={() => setStatusFilter(filter)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        statusFilter === filter
          ? 'bg-blue-500 text-white shadow-md'
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      {label}
      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
        statusFilter === filter
          ? 'bg-blue-400 text-white'
          : 'bg-gray-100 text-gray-600'
      }`}>
        {count}
      </span>
    </button>
  );

  const getStatusCounts = () => {
    if (theatres){

      return {
        all: theatres?.length,
        active: theatres?.filter(t => t.is_confirmed).length,
        inactive: theatres?.filter(t => !t.is_confirmed).length
      };

    }
  };

  const statusCounts = getStatusCounts();

  console.log(theatres)

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <div className='flex-1 p-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>Theatre Management</h1>
            <p className='text-gray-600'>Manage your theatre locations and their status</p>
          </div>

          <div className='mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center'>
            <div className='relative flex-1 max-w-md'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FaSearch className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='text'
                placeholder='Search by name, address, or pincode...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
              />
            </div>
          </div>

          <div className='mb-6 bg-white rounded-lg shadow-sm p-4'>
            <div className='flex items-center gap-2 mb-4'>
              <MdTheaters className='w-5 h-5 text-gray-600' />
              <h2 className='text-lg font-medium text-gray-700'>Filter by Status</h2>
            </div>
            <div className='flex flex-wrap gap-3'>
              <FilterButton filter="all" label="All" count={statusCounts.all} />
              <FilterButton filter="active" label="Active" count={statusCounts.active} />
              <FilterButton filter="inactive" label="Inactive" count={statusCounts.inactive} />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <MdTheaters className='h-8 w-8 text-blue-500' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>Total Theatres</p>
                  <p className='text-2xl font-semibold text-gray-900'>{theatres.length}</p>
                </div>
              </div>
            </div>
            
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='h-8 w-8 bg-green-100 rounded-full flex items-center justify-center'>
                    <MdTheaters className='h-5 w-5 text-green-600' />
                  </div>
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>Active Theatres</p>
                  <p className='text-2xl font-semibold text-gray-900'>{statusCounts.active}</p>
                </div>
              </div>
            </div>
            
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <div className='h-8 w-8 bg-red-100 rounded-full flex items-center justify-center'>
                    <MdTheaters className='h-5 w-5 text-red-600' />
                  </div>
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>Inactive Theatres</p>
                  <p className='text-2xl font-semibold text-gray-900'>{statusCounts.inactive}</p>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Theatre Name
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Address
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Pincode
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className='px-6 py-8 text-center'>
                        <div className='flex items-center justify-center'>
                          <svg className="animate-spin h-5 w-5 text-gray-400 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className='text-gray-500'>Loading theatres...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredTheatres.length > 0 ? (
                    filteredTheatres.map((theatre) => (
                      <tr key={theatre.id} className='hover:bg-gray-50 transition-colors'>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center'>
                            <div className='flex-shrink-0 h-10 w-10'>
                              <div className='h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center'>
                                <MdTheaters className='h-5 w-5 text-white' />
                              </div>
                            </div>
                            <div className='ml-4'>
                              <div className='text-sm font-medium text-gray-900'>
                                {theatre.theatre_name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='flex items-center text-sm text-gray-900'>
                            <HiOutlineLocationMarker className='h-4 w-4 text-gray-400 mr-1' />
                            <span className='truncate max-w-xs'>{theatre.address}</span>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          <div className='flex items-center'>
                            <MdLocationPin className='h-4 w-4 text-gray-400 mr-1' />
                            {theatre.pincode}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <StatusBadge isConfirmed={theatre.is_confirmed} />
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                          {theatre.is_confirmed ? (
                            <div className='flex gap-2'>
                              <button
                                onClick={() => handleShowScreen(theatre.id)}
                                className='inline-flex items-center px-3 py-1 border border-blue-300 text-blue-700 text-xs font-medium rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                              >
                                <FaEye className='w-3 h-3 mr-1' />
                                Screens
                              </button>
                              
                              <button
                                onClick={() => handleEdit(theatre.id)}
                                className='inline-flex items-center px-3 py-1 border border-gray-300 text-gray-700 text-xs font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500'
                              >
                                <CiEdit className='w-3 h-3 mr-1' />
                                Edit
                              </button>
                              <ConfirmDialog
                                title='are you sure?'
                                description='you will be lost theater cant be undone this action'
                                onConfirm={() => deleteCity(theatre.id)}
                              >

                                <button
                              
                                  disabled={processingId === theatre.id}
                                  className={`inline-flex items-center px-3 py-1 border border-red-300 text-red-700 text-xs font-medium rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                                    processingId === theatre.id ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                >
                                  {processingId === theatre.id ? (
                                    <>
                                      <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Deleting...
                                    </>
                                  ) : (
                                    <>
                                      <MdDelete className='w-3 h-3 mr-1' />
                                      Delete
                                    </>
                                  )}
                                </button>

                              </ConfirmDialog>
                            </div>
                          ) : (
                            <span className='text-gray-400 text-sm italic'>
                              Awaiting confirmation
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className='px-6 py-8 text-center'>
                        <div className='text-gray-500'>
                          {searchTerm || statusFilter !== 'all' 
                            ? 'No theatres found matching your filters.' 
                            : 'No theatres found. Add your first theatre to get started.'
                          }
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {filteredTheatres.length > 0 && (
            <div className='mt-4 text-sm text-gray-600'>
              Showing {filteredTheatres.length} of {theatres.length} theatres
              {searchTerm && ` matching "${searchTerm}"`}
              {statusFilter !== 'all' && ` (${statusFilter} only)`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListTheatre