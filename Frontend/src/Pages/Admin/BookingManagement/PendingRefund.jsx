import React, { useEffect, useState } from "react";
import Api from "@/axios/api";
import { Coins } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
const PendingRefund = () => {
  const [refunds, setRefunds] = useState([]);
  const { toast } = useToast();
  const [loadingRefundId, setLoadingRefundId] = useState(null)

  const formattTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  }

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const response = await Api.get("get-cancelled_booking/");
        setRefunds(response.data);
      } catch (error) {
        console.error("Error fetching refunds:", error);
      }
    };

    fetchRefunds();
  }, [loadingRefundId]);
  console.log(refunds, "refunds");

  const StatusBadge = ({ status }) => {
    const getStatusStyle = () => {
      switch (status?.toLowerCase()) {
        case "cancelled":
          return "bg-red-100 text-red-800 border-red-200";
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

  const onRefund = async (refund_id) => {
    setLoadingRefundId(refund_id)
    try {
      const res = await axios.post(`http://127.0.0.1:8000/booking/process-refund/${refund_id}/`)
      console.log(res.data)
      if (res.status === 200) {
        setRefunds((prevRefunds) =>
          prevRefunds.map((refund) =>
            refund.id === refund_id ? { ...refund, refunt_status: "completed" } : refund
          )
        );
        toast({
          title: res.data.message,
          description: "Refund Processed Successfully✅",
        })
      }
    } catch (error) {
      console.log(error)
      setLoadingRefundId(null)
      toast({
        title: error?.response?.data?.error,
        variant: "destructive",
      })
    } finally {
      setLoadingRefundId(null)
    }


  };

  console.log(refunds, "refunds");

  return (

    <div className="w-full max-w-screen-xl mx-auto mt-[10%]">
      <div className="flex justify-center" >

        <h1 className="font-medium " >Cancelled Tickets</h1>

      </div>

      <div className="space-y-2" >
        <div className="bg-gray-100 min-h-screen p-4">
          <div className="max-w-5xl mx-auto">
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
                {refunds.length > 0 ? (

                  refunds.map((refund, index) => (
                    <tr key={refund.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="font-medium" >{refund.theatre_name}</div>
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
                        <button
                          key={refund.id}
                          onClick={() => onRefund(refund.id)}
                          className="inline-flex items-center px-3 py-2 border-dashed border-2 text-sm leading-4 font-medium rounded-md  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <Coins className="w-4 h-4 mr-1" />
                          {loadingRefundId === refund.id ? 'processing......' : 'process refund'}
                        </button>
                      </td>
                    </tr>
                  ))


                ) : (

                  <tr>

                    <td className="px-6 py-4 w-full whitespace-nowrap text-sm font-medium" >

                      <div className="mx-auto">
                        <span> No Refund Payments are left </span>

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
  );
};


export default PendingRefund;