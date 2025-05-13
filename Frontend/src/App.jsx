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
import Seats from "./Pages/SeatSelection/seats";
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
function App() {

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<UserRoute><Landingpage/></UserRoute>}/>
                    <Route path="/movie/:id/details" element={<UserRoute><MovieSpecification /></UserRoute>} />
                    <Route path="/profile" element={<Profile/>} />
                    <Route path={`/available-show-details/:id`} element={<PrivateRoute><AvailableShowDetails/></PrivateRoute>} />
                    <Route path={'/available-show-details/:screenId/:showId/seats'} element={<PrivateRoute><Seats/></PrivateRoute>} />
                    <Route path="seat-layout/:location" element={
                        <PayPalScriptProvider options={{
                            "clientId" : PAYPAL_CLIENT_ID,
                            currency : 'USD'
                        }}>
                            <Checkout/>
                        </PayPalScriptProvider>
                        } />
                        
                    <Route path="payment/:booking_id/success" element={<PrivateRoute><PaymentSuccess/></PrivateRoute>} />
                    <Route path='movies/my-orders' element={<PrivateRoute><MyBookings/></PrivateRoute>} />
                    <Route path='booking/:id/ticket' element={<TicketView/>} />
                    <Route path='/blogs' element={<BlogPosts/>} />
                    <Route path='/blogs/add' element={<AddBlog/>} />
                    <Route path="/posts/details/:id" element={<BlogInfo/>}/>

                    {/* adminpages */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/*" element={<PrivateRoute><Admin_Pages/></PrivateRoute>}/>

                    {/* theatre owner */}
                    <Route path="/theatre/login" element={<Loginpage />} />
                    <Route path="/theatre-owner/*" element={<PrivateRoute><TheatreOwner/></PrivateRoute>} />

                </Routes>
            </Router>
        </>
    )
}

export default App
