import React, { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle, RotateCcw, Archive, X } from 'lucide-react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import TheatreApi from '../../../axios/theatreapi';

function Enquery() {
    const [activeTab, setActiveTab] = useState('pending');
    const [enquiries, setEnquiries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [selectedTheatre, setSelectedTheatre] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [archiveReason, setArchiveReason] = useState('');
    const [enquriesCount , setEnquiriesCount] = useState({
        pendingCount : 0,
        rejectedCount : 0,
        archievedCount : 0
    })
 
    useEffect(() => {
        fetchEnquiries();
    }, [activeTab, successMessage]);

    const fetchEnquiries = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await TheatreApi.get(`theatreowners/?tab=${activeTab}`);
            const data = res.data.enquiries;
            setEnquiriesCount({
                pendingCount : data.filter(e => e.ownership_status === 'pending').length,
                rejectedCount : data.filter(e => e.ownership_status === 'rejected').length
            })
            setEnquiries(res.data.enquiries || []);
        } catch (e) {
            setError(e.response?.data?.message || 'Error occurred while fetching data');
        } finally {
            setIsLoading(false);
        }
    };
    
    console.log(enquriesCount.pendingCount)

    const handleAccept = async (ownerProfileId, userId) => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await TheatreApi.post('theatreowners/', {
                'id': ownerProfileId,
                'ownership_status': 'confirmed',
                'userId': userId
            });
            setSuccessMessage(res.data.message);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (e) {
            setError(e.response?.data?.error || 'Unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            setError('Please provide a rejection reason');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const res = await TheatreApi.post('theatreowners/', {
                'id': selectedTheatre.id,
                'userId': selectedTheatre.user_id,
                'ownership_status': 'rejected',
                'rejection_reason': rejectionReason
            });
            setSuccessMessage(`${res.data.message} ❌`);
            setTimeout(() => setSuccessMessage(''), 3000);
            setShowRejectModal(false);
            setRejectionReason('');
            setSelectedTheatre(null);
            fetchEnquiries()
        } catch (e) {
            setError(e.response?.data?.error || 'Unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleArchive = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await TheatreApi.post('theatreowners/', {
                'id': selectedTheatre.id,
                'userId': selectedTheatre.user_id,
                'ownership_status': 'archived',
                'archive_reason': archiveReason
            });
            setSuccessMessage(`${res.data.message} 📁`);
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchEnquiries()
            setShowArchiveModal(false);
            setArchiveReason('');
            setSelectedTheatre(null);
        } catch (e) {
            setError(e.response?.data?.error || 'Unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestore = async (ownerProfileId, userId) => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await TheatreApi.post('theatreowners/restore/', {
                'id': ownerProfileId,
                'userId': userId
            });
            setSuccessMessage(`${res.data.message} 🔄`);
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchEnquiries()
        } catch (e) {
            setError(e.response?.data?.error || 'Unexpected error occurred');
        } finally {
            setIsLoading(false);
            
        }
    };

    const openRejectModal = (theatre) => {
        setSelectedTheatre(theatre);
        setShowRejectModal(true);
    };

    const openArchiveModal = (theatre) => {
        setSelectedTheatre(theatre);
        setShowArchiveModal(true);
    };

    const filteredEnquiries = enquiries.filter(enquiry =>
        enquiry.theatre_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'text-yellow-600 bg-yellow-50';
            case 'rejected': return 'text-red-600 bg-red-50';
            case 'archived': return 'text-gray-600 bg-gray-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className='flex min-h-screen bg-gray-100'>
            <div className='w-full p-6 mt-10'>
                <h2 className='text-center font-semibold text-2xl mb-8'>Theatre Owners Management</h2>

                <div className="flex justify-center mb-6">
                    <div className="flex bg-white rounded-lg shadow-sm p-1">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`px-6 py-2 rounded-md font-medium transition-colors ${
                                activeTab === 'pending'
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-600 hover:text-blue-500'
                            }`}
                        >
                            Pending {enquriesCount.pendingCount}
                        </button>
                        <button
                            onClick={() => setActiveTab('rejected')}
                            className={`px-6 py-2 rounded-md font-medium transition-colors ${
                                activeTab === 'rejected'
                                    ? 'bg-red-500 text-white'
                                    : 'text-gray-600 hover:text-red-500'
                            }`}
                        >
                            Rejected {enquriesCount.rejectedCount}
                        </button>
                        <button
                            onClick={() => setActiveTab('archived')}
                            className={`px-6 py-2 rounded-md font-medium transition-colors ${
                                activeTab === 'archived'
                                    ? 'bg-gray-500 text-white'
                                    : 'text-gray-600 hover:text-gray-500'
                            }`}
                        >
                            Archived {enquriesCount.archievedCount}
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6 flex justify-center">
                    <div className="w-full max-w-md">
                        <input
                            type="text"
                            placeholder="Search by theatre name or location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            <span className="text-green-700">{successMessage}</span>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                            <span className="text-red-700">{error}</span>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex justify-center items-center text-xl font-bold text-blue-600">
                        Loading...
                    </div>
                ) : filteredEnquiries.length === 0 ? (
                    <div className="flex justify-center text-gray-500 mt-5">
                        No {activeTab} enquiries found
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEnquiries.map((enquiry) => (
                            <Card key={enquiry.id} sx={{ maxWidth: 350 }}>
                                <CardContent>
                                    <div className="flex justify-between items-start mb-2">
                                        <Typography variant="h5" component="div" className="text-gray-700">
                                            {enquiry.theatre_name}
                                        </Typography>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enquiry.ownership_status)}`}>
                                            {enquiry.ownership_status}
                                        </span>
                                    </div>
                                    
                                    <div className='flex justify-center mb-3'>
                                        <img
                                            src={enquiry.owner_photo}
                                            alt="owner_pic"
                                            className='w-32 h-32 rounded-full object-cover'
                                        />
                                    </div>
                                    
                                    <Typography variant="body2" className="mb-1">
                                        <span className="text-gray-500 font-semibold">Location:</span> {enquiry.location}
                                    </Typography>
                                    <Typography variant="body2" className="mb-1">
                                        <span className="text-gray-500 font-semibold">State:</span> {enquiry.state}
                                    </Typography>
                                    <Typography variant="body2" className="mb-1">
                                        <span className="text-gray-500 font-semibold">Zipcode:</span> {enquiry.pincode}
                                    </Typography>
                                    <Typography variant="body2" className="mt-2">
                                        {enquiry.message}
                                    </Typography>
                                    
                                    {enquiry.rejection_reason && (
                                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                                            <Typography variant="body2" className="text-red-700">
                                                <span className="font-semibold">Rejection Reason:</span> {enquiry.rejection_reason}
                                            </Typography>
                                        </div>
                                    )}
                                    
                                    {enquiry.rejected_at && (
                                        <Typography variant="body2" className="mt-2 text-gray-500">
                                            <span className="font-semibold">Rejected At:</span> {new Date(enquiry.rejected_at).toLocaleDateString()}
                                        </Typography>
                                    )}
                                </CardContent>
                                
                                <div className="py-3 px-5 flex gap-2 justify-end">
                                    {activeTab === 'pending' && (
                                        <>
                                            <Button 
                                                variant="contained" 
                                                color="success" 
                                                onClick={() => handleAccept(enquiry.id, enquiry.user_id)}
                                                disabled={isLoading}
                                            >
                                                Accept
                                            </Button>
                                            <Button 
                                                variant="outlined" 
                                                color="error" 
                                                onClick={() => openRejectModal(enquiry)}
                                                disabled={isLoading}
                                            >
                                                Reject
                                            </Button>
                                            <Button 
                                                variant="outlined" 
                                                color="warning" 
                                                onClick={() => openArchiveModal(enquiry)}
                                                disabled={isLoading}
                                                startIcon={<Archive size={16} />}
                                            >
                                                Archive
                                            </Button>
                                        </>
                                    )}
                                    
                                    {(activeTab === 'rejected' || activeTab === 'archived') && (
                                        <Button 
                                            variant="outlined" 
                                            color="primary" 
                                            onClick={() => handleRestore(enquiry.id, enquiry.user_id)}
                                            disabled={isLoading}
                                            startIcon={<RotateCcw size={16} />}
                                        >
                                            Restore
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Reject Modal */}
                <Dialog open={showRejectModal} onClose={() => setShowRejectModal(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Reject Theatre Application</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" className="mb-4">
                            Please provide a reason for rejecting <strong>{selectedTheatre?.theatre_name}</strong>:
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Rejection Reason"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter the reason for rejection..."
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowRejectModal(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleReject} color="error" variant="contained">
                            Reject
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Archive Modal */}
                <Dialog open={showArchiveModal} onClose={() => setShowArchiveModal(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Archive Theatre Application</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" className="mb-4">
                            Please provide a reason for archiving <strong>{selectedTheatre?.theatre_name}</strong>:
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Archive Reason (Optional)"
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            value={archiveReason}
                            onChange={(e) => setArchiveReason(e.target.value)}
                            placeholder="Enter the reason for archiving..."
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowArchiveModal(false)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleArchive} color="warning" variant="contained">
                            Archive
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}

export default Enquery;