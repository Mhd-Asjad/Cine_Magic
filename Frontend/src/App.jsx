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
function App() {

    return (
        <>
            <Router>
                <Routes>
                    <Route path="/" element={<Landingpage />} />
                    <Route path="/movie/:id/details" element={<MovieSpecification />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path={`/available-show-details/:id`} element={<AvailableShowDetails/>} />
                    <Route path={'/available-show-details/:id/seats'} element={<Seats/>} />
                    <Route path="/checkout" element={<Checkout/>} />
                    
                    {/* adminpages */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/*" element={<Admin_Pages/>}/>

                    {/* theatre owner */}
                    <Route path="/theatre/login" element={<Loginpage />} />
                    <Route path="/theatre-owner/*" element={<TheatreOwner />} />

                </Routes>
            </Router>
        </>
    )
}

export default App
