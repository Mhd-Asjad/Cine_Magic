import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft, AlertCircle, CheckCircle, Clock, MessageSquare, Tag, MessageCircleDashed, BotMessageSquare, User } from 'lucide-react';
import apiReview from '@/axios/Reviewapi';
import { useNavigate, useParams } from 'react-router-dom';

const AdminResponsePage = ({ onBack }) => {
    const { id } = useParams()
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        status: '',
        response_message: '',
        is_resolved : null,
    });

    const statusOptions = [
        { value: 'open', label: 'Open', color: 'text-red-600', icon: AlertCircle },
        { value: 'in_progress', label: 'In Progress', color: 'text-yellow-600', icon: Clock },
        { value: 'resolved', label: 'Resolved', color: 'text-green-600', icon: CheckCircle },
        { value: 'closed', label: 'Closed', color: 'text-gray-600', icon: MessageSquare }
    ];

    useEffect(() => {
        if (id) {
            fetchComplaintDetails();
        }
    }, [id]);

    const fetchComplaintDetails = async () => {
        try {
            setLoading(true);
            const res = await apiReview.get(`complaint-detail/${id}/`);
            setComplaint(res.data);
            setFormData({
                status: res.data.status || 'open',
                response_message: res.data.response_message || ''
            });
            setError(null);
        } catch (error) {
            console.log(error, 'error while fetching complaint details');
            setError('Failed to fetch complaint details');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.status) {
            setError('Please select a status');
            return;
        }

        if (!formData.response_message) {
            setError('please update response message')
            return;
        }

        console.log(formData , 'sending backend')

        try {
            setSaving(true);
            setError(null);

            await apiReview.patch(`update-complaint/${id}/`, formData);

            setSuccessMessage('Complaint response updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);

            fetchComplaintDetails();

        } catch (error) {
            console.log(error, 'error while updating complaint');
            setError('Failed to update complaint response');
        } finally {
            setSaving(false);
        }
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => {
            let updated = {
            ...prev,
            [field]: value,
            };

            if (field === 'status') {
            updated.is_resolved = value === 'resolved';
            }

            return updated;
        });
    };

    
    console.log(formData)

    const goBack = () => {
        navigate(onBack)
    }

    const getStatusIcon = (status) => {
        const statusOption = statusOptions.find(opt => opt.value === status);
        const IconComponent = statusOption?.icon || AlertCircle;
        return <IconComponent className="w-5 h-5" />;
    };

    const getStatusColor = (status) => {
        const statusOption = statusOptions.find(opt => opt.value === status);
        return statusOption?.color || 'text-gray-600';
    };

    const getCategoryColor = (category) => {
        const colors = {
            booking: 'bg-blue-100 text-blue-700',
            payment: 'bg-purple-100 text-purple-700',
            technical: 'bg-orange-100 text-orange-700',
            service: 'bg-teal-100 text-teal-700'
        };
        return colors[category] || 'bg-gray-100 text-gray-700';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading complaint details...</p>
                </div>
            </div>
        );
    }


    if (error && !complaint) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Complaint</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={goBack}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="mt-[5%] p-6">
            <button
                onClick={goBack}
                className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Complaints
            </button>

            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Admin Response</h1>
                <p className="text-gray-600">Update complaint status and provide response</p>
            </div>

            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-green-700">{successMessage}</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                        <span className="text-red-700">{error}</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Complaint Details</h2>

                        {complaint && (
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">{complaint.subject}</h3>
                                        <p className="text-sm text-gray-500">Complaint ID: #{complaint.id}</p>
                                    </div>
                                    <div className={`flex items-center ${getStatusColor(complaint.status)}`}>
                                        {getStatusIcon(complaint.status)}
                                        <span className="ml-2 capitalize">
                                            {complaint.status?.replace('_', ' ') || 'Open'}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t pt-4 flex justify-between">
                                    <div>

                                        <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                                        <p className="text-gray-700">{complaint.description}</p>
                                    </div>

                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Category</span>

                                        <p className={`text-sm font-semibold py-1 px-1 rounded ${getCategoryColor(complaint.category)}`}>

                                            <Tag className="w-3 h-3 mr-1 inline" />
                                            {complaint.category}

                                        </p>
                                    </div>

                                </div>




                                <div className='flex justify-center border-t mt-2' >
                                    <h1 className='font-medium text-sm' > <MessageCircleDashed className='inline' /> chat History </h1>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 ">

                                    <div className=' py-2 px-2' >
                                        <span className="text-sm font-medium text-gray-500"> <User className='inline' /> user message</span>
                                        <p className="text-gray-900 capitalize">{complaint.chat_details.message || 'General'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-500"><BotMessageSquare className='inline' /> bot response</span>
                                        <p className="text-gray-900 capitalize">{complaint.chat_details.reply || 'General'}</p>
                                    </div>

                                </div>


                                {complaint.response_message && (
                                    <div className="border-t pt-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Previous Response</h4>
                                        <div className="bg-gray-50 p-3 rounded-md">
                                            <p className="text-gray-700">{complaint.response_message}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Update Response</h2>

                        <div className="space-y-6">
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                                >
                                    <option value="">Select Status</option>
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="response_message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Response Message
                                </label>
                                <textarea
                                    id="response_message"
                                    value={formData.response_message}
                                    onChange={(e) => handleInputChange('response_message', e.target.value)}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-vertical"
                                    placeholder="Enter your response to the user..."
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Provide a detailed response to help resolve the user's complaint.
                                </p>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="w-full flex items-center justify-center px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Update Response
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminResponsePage;