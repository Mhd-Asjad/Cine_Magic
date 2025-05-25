import React from "react"
import Landingpage from "./Pages/Home/Landingpage";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLogin from "./Pages/Admin/AdminLogin";
import 'toastr/build/toastr.min.css';
import MovieSpecification from "./Pages/MovieDetails/MovieSpecification";
import Profile from "./Pages/Profile/Profile";
import Admin_Pages from "./Components/Admin/Admin_Pages";
import Loginpage from "./Pages/Theatreowner/Loginpage";
import TheatreOwner from "./Components/Theatre/TheatreOwner";
import AvailableShowDetails from "./Pages/ShowTimeDetails/AvailableShowDetails";
import Seats from "./Pages/SeatSelection/Seats";
import Checkout from "./Pages/userbooking/Checkout";
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaymentSuccess from "./Pages/Payment/PaymentSuccess";
import MyBookings from "./Pages/Bookings/MyBookings";
import TicketView from "./Pages/Bookings/TicketView";
import BlogPosts from "./Pages/blogs/BlogPosts";
import AddBlog from "./Pages/blogs/AddBlog";
import PrivateRoute from "./Pages/Routes/PrivateRoute";
import { UserRoute } from "./Pages/Routes/ProtectedRoute";
import BlogInfo from "./Pages/blogs/BlogInfo";
import VerifiedTicket from "./Pages/Bookings/VerifiedTicket";
function App() {

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Landingpage/> }/>
                    <Route path="/movie/:id/details" element={<PrivateRoute><MovieSpecification/></PrivateRoute>} />
                    <Route path="/profile" element={<Profile/>} />
                    <Route path={`/available-show-details/:id`} element={<AvailableShowDetails/>} />
                    <Route path={'/available-show-details/:screenId/:showId/seats'} element={<Seats/>} />

                    <Route path="seat-layout/" element={
                            <PayPalScriptProvider options={{
                                "clientId" : PAYPAL_CLIENT_ID,
                                currency : 'USD'
                            }}>
                                <Checkout/>
                            </PayPalScriptProvider>
                            } />
                        
                    <Route path="payment/:booking_id/success" element={<PaymentSuccess/>} />
                    <Route path='movies/my-orders' element={<MyBookings/>} />
                    <Route path='booking/:id/ticket' element={<TicketView/>} />
                    <Route path='verify-ticket/:id' element={<VerifiedTicket/>} />
                    <Route path='/blogs' element={<BlogPosts/>} />
                    <Route path='/blogs/add' element={<AddBlog/>} />
                    <Route path="/posts/details/:id" element={<BlogInfo/>}/>

                    {/* adminpages */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/*" element={<PrivateRoute allowedTypes='admin' ><Admin_Pages/></PrivateRoute>}/>

                    {/* theatre owner */}
                    <Route path="/theatre/login" element={<Loginpage />} />
                    <Route path="/theatre-owner/*" element={<TheatreOwner/>} />

                </Routes>
            </Router>
        </>
    )
}

export default App
