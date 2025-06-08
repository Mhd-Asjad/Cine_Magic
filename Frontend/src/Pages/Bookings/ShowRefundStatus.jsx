import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import apiBooking from '@/axios/Bookingapi';
import { X } from 'lucide-react';
function ShowRefundStatus({ refundId , openStatus }) {
    const [refundStatus, setRefundStatus] = useState(null);
    const { toast } = useToast();

    useEffect(() => {
        if (refundId) {
            fetchRefundStatus();
        }
    }, [refundId]);

    useEffect(() => {
        if (refundStatus) {
            toast({
                title: "Refund Status Update",
                description: `Your refund status is: ${refundStatus.refund_status}`,
                variant: "default",
            });
        }
    }, [refundStatus]);

    const fetchRefundStatus = async () => {
        try {
            const response = await apiBooking.get(`booking-status/${refundId}/`);
            console.log(response.data)
            setRefundStatus(response.data.status);
        } catch (e) {
            console.error("Error fetching refund status:", e);
            toast({
                title: "Error",
                description: "Could not fetch refund status.",
                variant: "destructive",
            });
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending':
                return { text: 'Pending', color: 'text-yellow-500' };
            case 'completed':
                return { text: 'Completed', color: 'text-green-600' };
            case 'failed':
                return { text: 'Failed', color: 'text-red-600' };
            case 'not_applicable':
                return { text: 'Not Applicable', color: 'text-gray-500' };
            default:
                return { text: 'Unknown', color: 'text-gray-400' };
        }
    };

    const statusInfo = refundStatus ? getStatusStyle(refundStatus.refund_status) : null;
    console.log(refundStatus, "refund status");
    return (
        <div className="relative p-4 w-full border rounded-lg shadow-md bg-white">

            <h2 className="text-xl font-semibold text-gray-800 mb-4">Refund / Cancellation Status</h2>
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={() => openStatus(prev => (!prev))} 
                >
                    <X size={20} />
                    
                </button>
            {refundStatus ? (
                <div>
                    <p className={`text-lg font-medium ${statusInfo.color}`}>
                        Status: {statusInfo.refund_status}
                    </p>
                    {refundStatus.refund_status === 'pending' && (
                    
                        <p className="text-gray-600 mt-2">

                            Your cancellation request is being processed. Please wait for confirmation.
                        </p>
                        
                    )}
                    {refundStatus.refund_status === 'completed' && (
                        <p className="text-gray-600 mt-2">
                            Your refund has been successfully completed! ₹{Math.abs(refundStatus.refund_amount)}Rs has been credited to account🎉
                        </p>
                    )}
                    {refundStatus.refund_status === 'failed' && (
                        <p className="text-gray-600 mt-2">
                            Unfortunately, your refund process failed. Please contact support.
                        </p>
                    )}
                    {refundStatus.refund_status === 'not_applicable' && (
                        <p className="text-gray-600 mt-2">
                            Refund not applicable for this ticket🚫 cancellation has been confirmed✅.
                        </p>
                    )}
                </div>
            ) : (
                <p className="text-gray-500">taking refund status...</p>
            )}
        </div>
    );
}

export default ShowRefundStatus;
