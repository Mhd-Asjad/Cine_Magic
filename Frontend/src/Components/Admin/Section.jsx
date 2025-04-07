import React from 'react'
import {BrowserRouter as Router , Route , Routes} from 'react-router-dom'
import PrivateRoute from '@/Pages/Admin/PrivateRoute'
import Dashboard from '@/Pages/Admin/Dashboard/Dashboard';
import CustomerManagement from '@/Pages/Admin/Customer/CustomerManagement';
import ListMovies from "@/Pages/Admin/MovieManagement/ListMovies";
import AddMovies from "@/Pages/Admin/MovieManagement/AddMovies";
import Enquery from "@/Pages/Admin/Customer/Enquery";
import EditTheatre from "@/Pages/Theatreowner/TheatreManagement/EditTheatre";
import ShowRequest from '@/Pages/Admin/TheatreManagement/ShowRequest';
import EditMovie from '@/Pages/Admin/MovieManagement/EditMovie';

function Section() {
  return (
    <div>
        <Routes>
            <Route path="dashboard" element={<PrivateRoute> <Dashboard /></PrivateRoute>}/>
            <Route path="customers" element={<PrivateRoute><CustomerManagement /></PrivateRoute>} />
            <Route path="enquery" element={<PrivateRoute> <Enquery /> </PrivateRoute>} />
            <Route path="movies" element={<PrivateRoute><ListMovies /></PrivateRoute>} />
            <Route path="movies/:movie_id/edit" element={<PrivateRoute><EditMovie/></PrivateRoute>} />
            <Route path='addmovies' element={<PrivateRoute><AddMovies /></PrivateRoute>} />
            <Route path="theatres/:theatreId/edit" element={<PrivateRoute><EditTheatre /></PrivateRoute>} />
            <Route path='showtheatres' element={<PrivateRoute><ShowRequest/></PrivateRoute>} />
            
        </Routes>
      
    </div>
  )
}

export default Section
