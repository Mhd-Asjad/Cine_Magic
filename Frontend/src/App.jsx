import React from "react"
import Landingpage from "./Pages/Home/Landingpage";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLogin from "./Pages/Admin/AdminLogin";
import PrivateRoute from "./Pages/Admin/PrivateRoute";
import Dashboard from "./Pages/Admin/Dashboard/Dashboard";
import CustomerManagement from "./Pages/Admin/Customer/CustomerManagement";
import ListCity from "./Pages/Admin/CityManagement/ListCity";
import CityTheatre from "./Pages/Admin/TheatreManagement/CityTheatre";
import ListMovies from "./Pages/Admin/MovieManagement/ListMovies";
import AddMovies from "./Pages/Admin/MovieManagement/AddMovies";
import EditTheatre from "./Pages/Admin/TheatreManagement/EditTheatre";
import 'toastr/build/toastr.min.css';
import MovieSpecification from "./Pages/MovieDetails/MovieSpecification";
import Profile from "./Pages/Profile/Profile";

function App() {

  return (
    <>
     <Router>
            <Routes>
                <Route path="/" element={<Landingpage />} />
                <Route path="movie/:id/details" element={<MovieSpecification/>} />
                <Route path="/profile" element={<Profile/>} />

                


                <Route path="/admin/login" element={<AdminLogin/>} />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                    />
                    
                    <Route path="/customers" element={<PrivateRoute><CustomerManagement/></PrivateRoute>} />
                    <Route path="/dashboard/movies" element={<PrivateRoute><ListMovies/></PrivateRoute>} />
                    <Route path='/dashboard/movies/addmovies' element={<PrivateRoute><AddMovies/></PrivateRoute>}/>
                    <Route path="/cities" element={<PrivateRoute><ListCity/></PrivateRoute>} />
                    <Route path="/cities/:cityId/theatres" element={<PrivateRoute><CityTheatre/></PrivateRoute>} />
                    <Route path="/theatres/:theatreId/edit" element={<PrivateRoute><EditTheatre/></PrivateRoute>} />
            
            </Routes>
        </Router>
    </>
  )
}

export default App
