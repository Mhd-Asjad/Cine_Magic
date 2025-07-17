import React, { useState } from "react"
import Landingpage from "./pages/home/Landingpage";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLogin from "./pages/admin/AdminLogin";
import 'toastr/build/toastr.min.css';
import MovieSpecification from "./pages/moviedetails/MovieSpecification";
import Profile from "./pages/profile/Profile";
import Admin_Pages from "./components/admin/Admin_Pages";
import Loginpage from "./pages/theatreowner/Loginpage";
import TheatreOwner from "./components/theatre/TheatreOwner";
import AvailableShowDetails from "./pages/showdimedetails/AvailableShowDetails";
import Seats from "./pages/seatselection/Seats";
import Checkout from "./pages/userbooking/Checkout";
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import MyBookings from "./pages/bookings/MyBookings";
import TicketView from "./pages/bookings/TicketView";
import BlogPosts from "./pages/blogs/BlogPosts";
import AddBlog from "./pages/blogs/AddBlog";
import PrivateRoute from "./pages/routes/PrivateRoute";
import BlogInfo from "./pages/blogs/BlogInfo";
import VerifiedTicket from "./pages/bookings/VerifiedTicket";
import ResetPassword from "./pages/userauth/ResetPassword";
import FAQPage from "./pages/usercomplaints/FAQPage";
import UpcomingMovieDetails from "./pages/moviedetails/UpcomingMovieDetails";
import UserNotificationPage from "./pages/notification/UserNotifications"
import UserReview from "./pages/moviedetails/UserReview";
import PageNotFound from "./pages/PageNotFound";

function App() {
    
    return (
        <>
            <Router>
                <Routes>
                    <Route path="*" element={<PageNotFound/>} />
                    <Route path="/" element={<Landingpage/>}/>
                    <Route path="/movie/:id/details" element={<MovieSpecification/>} />
                    <Route path="/movie/:movieId" element={<UpcomingMovieDetails/>} />
                    <Route path="/profile" element={<Profile/>} />
                    <Route path={`/available-show-details/:id`} element={<AvailableShowDetails/>} />
                    <Route path={'/available-show-details/:screenId/:showId/seats'} element={<Seats/>} />

                    <Route path="seat-layout/" element={
                            <PayPalScriptProvider options={{
                                "clientId" : PAYPAL_CLIENT_ID,
                                currency : 'USD'
                            }}>
                                <PrivateRoute allowedTypes={'user'}
                                >
                                    <Checkout/>
                                </PrivateRoute>
                            </PayPalScriptProvider>
                            } />
                        
                    <Route path="payment/:booking_id/success" element={<PaymentSuccess/>} />
                    <Route path='movies/my-orders' element={<MyBookings/>} />
                    <Route path='booking/:id/ticket' element={<TicketView/>} />
                    <Route path='verify-ticket/:id' element={<VerifiedTicket/>} />
                    <Route path='/blogs' element={<BlogPosts/>} />
                    <Route path='/blogs/add' element={<AddBlog/>} />
                    <Route path="/posts/details/:id" element={<BlogInfo/>}/>
                    <Route path="/reset-password" element={<ResetPassword/>} />
                    <Route path="/complaint/assistant" element={<FAQPage/>} />
                    <Route path="/notifications" element={<UserNotificationPage />} />
                    <Route path="/movie/reviews/:id" element={<UserReview/>} />

                    {/* adminpages */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/*" element={<PrivateRoute allowedTypes='admin' ><Admin_Pages/></PrivateRoute>}/>

                    {/* theatre owner */}
                    <Route path="/theatre/login" element={<Loginpage />} />
                    <Route path="/theatre-owner/*" element={<PrivateRoute allowedTypes='theatre' ><TheatreOwner/></PrivateRoute>} />

                </Routes>
            </Router>
        </>
    )
}

export default App
