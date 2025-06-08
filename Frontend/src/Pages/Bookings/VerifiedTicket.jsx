import apiBooking from '@/Axios/Bookingapi';
import Nav from '@/components/Navbar/Nav';
import React, { useEffect, useState } from 'react';
import { useParams , useNavigate } from 'react-router-dom';

function VerifiedTicket() {
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTicketValidation = async () => {
      try {
        const res = await apiBooking.get(`validate-ticket/${id}/`);
        setTicket(res.data);
      } catch (e) {
        setError(e?.response?.data?.error || 'Something went wrong');

        setTimeout(() => {
          navigate('/')
        },2000)
      }
    };
    fetchTicketValidation();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100">
       <Nav/>
      <div className="flex flex-col items-center justify-center mt-[8%] px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl text-center">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Ticket Verification
          </h1>

          {error ? (
            <div className="text-red-600 text-lg font-medium">
              ❌ {error}
            </div>
          ) : ticket ? (
            <div className="space-y-4 text-left">
              <p className="text-green-600 text-lg font-medium">
                ✅ Your ticket is valid and payment has been processed!
              </p>
              <div className="mt-4 space-y-2 text-gray-700">
                <p><strong>Booking ID:</strong> {ticket.booking_id}</p>
                <p><strong>Status:</strong> {ticket.status}</p>
                <p><strong>Show:</strong> {ticket.show_name}</p>
                <p><strong>Email:</strong> {ticket.customer_email}</p>
                <p><strong>Amount Paid:</strong> ₹{ticket.amount}</p>
                    </div>
            </div>
          ) : (
            <p className="text-gray-500">Checking ticket validity...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifiedTicket;