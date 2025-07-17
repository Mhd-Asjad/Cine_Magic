import React, { useEffect, useState } from "react";
import Api from "@/axios/api";
import { Coins, Filter } from "lucide-react";
import { toast } from "sonner";
import apiBooking from "@/axios/Bookingapi";
import { ShieldAlert } from "lucide-react";
import { icon } from "leaflet";
import ConfirmDialog from "@/components/ConfirmDialog";

const PendingRefund = () => {
  const [refunds, setRefunds] = useState([]);
  const [filteredRefunds, setFilteredRefunds] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loadingRefundId, setLoadingRefundId] = useState(null);

  const formattTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const response = await Api.get("get-cancelled_booking/");
        setRefunds(response.data);
        setFilteredRefunds(response.data);
      } catch (error) {
        console.error("Error fetching refunds:", error);
      }
    };

    fetchRefunds();
  }, [loadingRefundId]);

  // Filter functionality
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredRefunds(refunds);
    } else {
      const filtered = refunds.filter(refund => {
        const status = (refund.refunt_status || refund.refund_status)?.toLowerCase();
        return status === activeFilter;
      });
      setFilteredRefunds(filtered);
    }
  }, [activeFilter, refunds]);

  const getStatusCounts = () => {
    const counts = {
      all: refunds.length,
      pending: 0,
      completed: 0
    };
    
    refunds.forEach(refund => {
      const status = (refund.refunt_status || refund.refund_status)?.toLowerCase();
      if (counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();

  const StatusBadge = ({ status }) => {
    const getStatusStyle = () => {
      switch (status?.toLowerCase()) {
        case "pending":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "completed":
          return "bg-green-100 text-green-800 border-green-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyle()}`}>
        {status || "Unknown"}
      </span>
    );
  };

  const FilterButton = ({ filter, label, count }) => (
    <button
      onClick={() => setActiveFilter(filter)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        activeFilter === filter
          ? 'bg-blue-500 text-white shadow-md'
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      {label}
      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
        activeFilter === filter
          ? 'bg-blue-400 text-white'
          : 'bg-gray-100 text-gray-600'
      }`}>
        {count}
      </span>
    </button>
  );

  const onRefund = async (refund_id) => {
    setLoadingRefundId(refund_id);
    try {
      const res = await apiBooking.post(`process-refund/${refund_id}/`);
      console.log(res.data);
      if (res.status === 200) {
        setRefunds((prevRefunds) =>
          prevRefunds.map((refund) =>
            refund.id === refund_id ? { ...refund, refunt_status: "completed" } : refund
          )
        );
        toast(
          res.data.message,
          {
            icon: <Coins className="w-6 h-6 text-green-500" />,
            style: {
              backgroundColor: '#f0f9ff',
              color: '#0369a1',
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
      setLoadingRefundId(null);
      toast(
       error?.response?.data?.error,{
       icon : <ShieldAlert className="w-6 h-6 text-red-500" />,
      });
    } finally {
      setLoadingRefundId(null);
    }
  };

  const shouldShowAction = (status) => {
    const normalizedStatus = status?.toLowerCase();
    return normalizedStatus === "pending";
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto mt-2">
      {/* Filter Section */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-medium text-gray-700">Filter by Status</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <FilterButton filter="all" label="All" count={statusCounts.all} />
          <FilterButton filter="pending" label="Pending" count={statusCounts.pending} />
          <FilterButton filter="completed" label="Completed" count={statusCounts.completed} />
        </div>
      </div>

      <div className="space-y-2 ">
        <div className="bg-gray-50 min-h-screen p-4 rounded-lg">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">No</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Theatre Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Booking</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Show Details</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Refund Amount</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-xs text-center font-medium text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRefunds.length > 0 ? (
                    filteredRefunds.map((refund, index) => (
                      <tr key={refund.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="font-medium">{refund.theatre_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="font-medium">{refund.booking_id}</div>
                          <div className="text-xs text-gray-400">Show #{refund.show}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="font-medium">{refund.customer_name}</div>
                          <div className="text-xs">{refund.customer_email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{new Date(refund.show_date).toLocaleDateString()}-{formattTime(refund.show_time)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm ml-4 font-medium text-gray-900">
                            ₹{parseFloat(refund.refund_amount || refund.refunt_amount).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="mt-1">
                            <StatusBadge status={refund.refunt_status || refund.refund_status} />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {shouldShowAction(refund.refunt_status) ? (
                            <ConfirmDialog
                              title="are you sure to rufund ?"
                              description="click the confirm button to rund and cancel if not sure"
                              onConfirm={() => onRefund(refund.id)}
                            >
                            <button
                            key={refund.id}
                            disabled={loadingRefundId === refund.id}
                            className={`inline-flex items-center px-3 py-2 border-dashed border-2 text-sm leading-4 font-medium rounded-md transition-colors ${
                              loadingRefundId === refund.id
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                          >
                            <Coins className="w-4 h-4 mr-1" />
                            {loadingRefundId === refund.id ? 'Processing...' : 'Process Refund'}
                          </button>

                            </ConfirmDialog>
                          ) : (
                            <span className="text-gray-400 text-sm italic">
                              No action needed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center">
                        <div className="text-gray-500">
                          {activeFilter === "all" 
                            ? "No refund payments are left" 
                            : `No ${activeFilter} refunds found`
                          }
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingRefund;