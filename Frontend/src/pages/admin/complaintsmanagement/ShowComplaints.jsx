import React, { useEffect, useState } from 'react';
import { Eye, MessageSquare, Calendar, User, CircleArrowRight, AlertCircle, CheckCircle, Clock, Loader } from 'lucide-react';
import apiReview from '@/axios/Reviewapi';
import { useNavigate } from 'react-router-dom';

const ShowComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const res = await apiReview.get('show-complaints/');
        setComplaints(res.data);
        setError(null);
      } catch (error) {
        console.log(error, 'error while fetching user complaints');
        setError('Failed to fetch complaints');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const getStatusColor = (status, isResolved) => {
    if (isResolved) return 'bg-green-100 text-green-700 border-green-200';
    switch (status) {
      case 'open': return 'bg-red-100 text-red-700 border-red-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'closed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status, isResolved) => {
    if (isResolved) return <CheckCircle className="w-4 h-4" />;
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredComplaints = () => {
    if (!Array.isArray(complaints)) return [];
    
    return complaints.filter(complaint => {
      if (filter === 'all') return true;
      if (filter === 'resolved') return complaint.is_resolved;
      if (filter === 'unresolved') return !complaint.is_resolved;
      return complaint.status === filter;
    });
  };

  const getComplaintStats = () => {
    if (!Array.isArray(complaints)) return { open: 0, inProgress: 0, resolved: 0, total: 0 };
    
    return {
      open: complaints.filter(c => c.status === 'open' && !c.is_resolved).length,
      inProgress: complaints.filter(c => c.status === 'in_progress').length,
      resolved: complaints.filter(c => c.is_resolved).length,
      total: complaints.length
    };
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000
    },
    largeImage: {
      maxWidth: '90%', maxHeight: '90%', borderRadius: '10px'
    }
  };

  const stats = getComplaintStats();
  const filteredComplaints = getFilteredComplaints();

  const handleImageClick = (url) => {
    setSelectedImage(url);
  }

  const closeModal = () => {
    setSelectedImage(null);
  };

  const ComplaintCard = ({ complaint , index }) => (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      
      >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(complaint.status, complaint.is_resolved)}`}>
            {getStatusIcon(complaint.status, complaint.is_resolved)}
            <span className="ml-1 capitalize">
              {complaint.is_resolved ? 'Resolved' : complaint.status?.replace('_', ' ') || 'Open'}
            </span>
          </span>
        </div>
        <span 
          className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semid-bold cursor-pointer'        
          onClick={() => navigate(`/admin/complaint/action/${complaint.id}`)}
        
        >
          <CircleArrowRight className="text-gray-600 mr-1" size={28}/>
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{complaint.subject}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{complaint.description}</p>

      <div className="flex items-center justify-between text-sm gap-4 text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {complaint.user_name || `User ${complaint.user}`}
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(complaint.created_at)}
          </div>
        </div>
        <div className="flex items-center space-x-2">
         
          {complaint.screen_shot && (
            <button className="flex items-center px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={() => handleImageClick(complaint.screen_shot)}
            >
              <Eye className="w-4 h-4 mr-1" />
              Screenshot
            </button>
          )}
        </div>
      </div>
      { selectedImage && (
          <div style={styles.overlay} onClick={closeModal}>
           
            <img
              src={selectedImage}
              alt="Large View"
              style={styles.largeImage}
              onClick={(e) => e.stopPropagation()} 
            />

        </div>
      )}

    </div>
    
  );

  

  console.log(complaints)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading complaints...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Complaints</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complaints Management</h1>
          <p className="text-gray-600">Monitor and manage customer complaints</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Open Complaints</p>
                <p className="text-2xl font-bold text-gray-900">{stats.open}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-gray-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {['all', 'open', 'in_progress', 'resolved', 'unresolved'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {filteredComplaints.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredComplaints.map((complaint  , index) => (
              <ComplaintCard key={complaint.id} index={index} complaint={complaint} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints found</h3>
            <p className="text-gray-500">
              {complaints.length === 0 
                ? 'No complaints have been submitted yet.' 
                : 'No complaints match your current filter criteria.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowComplaints;