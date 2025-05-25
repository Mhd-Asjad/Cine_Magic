import React from 'react'
import {BrowserRouter as Router , Route , Routes} from 'react-router-dom'
import PrivateRoute from '@/Pages/Routes/PrivateRoute'
import Dashboard from '@/Pages/Admin/Dashboard/Dashboard';
import CustomerManagement from '@/Pages/Admin/Customer/CustomerManagement';
import ListMovies from "@/Pages/Admin/MovieManagement/ListMovies";
import AddMovies from "@/Pages/Admin/MovieManagement/AddMovies";
import Enquery from "@/Pages/Admin/Customer/Enquery";
import EditTheatre from "@/Pages/Theatreowner/TheatreManagement/EditTheatre";
import ShowRequest from '@/Pages/Admin/TheatreManagement/ShowRequest';
import EditMovie from '@/Pages/Admin/MovieManagement/EditMovie';
import ShowTheatres from '@/Pages/Admin/TheatreManagement/Showtheatres';
import { AdminRoute } from '@/Pages/Routes/ProtectedRoute';
import PendingRefund from '@/Pages/Admin/BookingManagement/PendingRefund';
import ShowBookings from '@/Pages/Theatreowner/BookingManagement/ShowBookings';
import ExcelDownloadComponent from '@/Pages/Admin/Dashboard/ExcelDownloadComponent';
function Section() {
  return (
    <div>
        <Routes>
            <Route path="dashboard" element={<AdminRoute> <Dashboard /></AdminRoute>}/>
            <Route path='download/reports' element={<AdminRoute><ExcelDownloadComponent/></AdminRoute>} />
            <Route path="customers" element={<PrivateRoute><CustomerManagement /></PrivateRoute>} />
            <Route path="enquery" element={<PrivateRoute> <Enquery /> </PrivateRoute>} />
            <Route path="movies" element={<PrivateRoute><ListMovies /></PrivateRoute>} />
            <Route path="movies/:movie_id/edit" element={<PrivateRoute><EditMovie/></PrivateRoute>} />
            <Route path='add-movies' element={<PrivateRoute><AddMovies /></PrivateRoute>} />
            <Route path="theatres/:theatreId/edit" element={<PrivateRoute><EditTheatre /></PrivateRoute>} />
            <Route path='pending-theatres' element={<PrivateRoute><ShowRequest/></PrivateRoute>} />
            <Route path='showtheatres' element={<PrivateRoute><ShowTheatres/></PrivateRoute>} />
            <Route path='bookings' element={<PendingRefund/>} ></Route>
            
        </Routes>
      
    </div>
  )
}

export default Section
