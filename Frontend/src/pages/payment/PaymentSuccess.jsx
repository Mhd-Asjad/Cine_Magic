import { Card } from "@/components/ui/card"
import { Link, useParams } from "react-router-dom"
import React , {useState , useEffect} from "react";
import useBookingWebSocket from "@/contexts/useNotificationSocket";
import Nav from "@/components/navbar/Nav";
import apiBooking from "@/axios/Bookingapi";
import { useSelector } from "react-redux";
function PaymentSuccess() {
    const [isLoading, setIsLoading] = useState(true);
    const {booking_id} = useParams()
    const [ booking , setBookingDetails ] = useState([]);
    const userId = useSelector((state) => state.user.id)
    const notifications = useSelector((state) => state.notifications.notifications)
    useEffect(() => {
      const fetchBooking = async() => {
        try {
          const res = await apiBooking.get(`booking-info/${booking_id}/`)
          setBookingDetails(res.data)
        }catch(e){
          console.log(e , 'fetching Error')
        }
      }
      fetchBooking()
    },[booking_id])

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000); 
  
      return () => clearTimeout(timer);
    }, []);

    

    // useEffect(() => {
    //   const socket = new WebSocket(`ws://localhost:8000/ws/notifications/${userId}/`);

    //   socket.onopen = () => {
    //     console.log('websocket is connected');
    //   };

    //   socket.onmessage = (event) => {
    //     const data = JSON.parse(event.data);
    //     console.log(data, 'server sended data while booking created');
    //     setNotification(data.message);
    //     setTimeout(() => setNotification(''), 5000);
    //   };

    //   socket.onclose = () => {
    //     console.log('websocket disconnected');
    //   };

    //   socket.onerror = (error) => {
    //     console.log('WebSocket error', error);
    //   };

    //   return () => socket.close();
    // }, [userId]);

  useBookingWebSocket(userId);
  console.log(notifications)

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loader" ></div>
            </div>
        )
    }

  const formatTime = (timeString) => {
    const [hours , minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours , minutes)
    return date.toLocaleTimeString([] , {hour : '2-digit' , minute : '2-digit' , hour12:true});
  }


    console.log(window.location.host)
  return (
    <div>
        <Nav/>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="max-w-md w-full space-y-6 p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="flex flex-col items-center">
          <CircleCheckIcon className="text-green-500 h-16 w-16" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mt-4">Payment Successful</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Thank you for your payment
          </p>

          {/* {notification && (
            <div className="mt-4 p-4 bg-blue-100 text-blue-800 rounded">
              {notification}
            </div>
          )} */}
        </div>


        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Amount Paid:</span>
            <span className="font-medium text-gray-900 dark:text-gray-50">  ₹ {booking.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Payment Method:</span>
            <span className="font-medium text-gray-900 dark:text-gray-50">Paypal Payment</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Date &amp; Time:</span>
            <span className="font-medium text-gray-900 dark:text-gray-50">{booking.show_date} at {formatTime(booking.show_time)} </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Payment Status :</span>
            <span className="font-medium text-green-700 dark:text-gray-50">{booking.status}</span>
          </div>
        </div>



        <div className="flex justify-center">
          <Link
            to={'/movies/my-orders'}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-300"
            prefetch={false}
          >
            View Order History
          </Link>
        </div>
      </Card>
    </div>
    </div>
  )
}

function CircleCheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
export default PaymentSuccess