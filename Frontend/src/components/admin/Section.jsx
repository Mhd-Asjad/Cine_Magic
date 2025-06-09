import React from 'react'
import {BrowserRouter as Router , Route , Routes} from 'react-router-dom'
import PrivateRoute from '@/pages/routes/PrivateRoute'
import Dashboard from '@/pages/admin/dashboard/Dashboard';
import CustomerManagement from '@/pages/admin/customer/CustomerManagement';
import ListMovies from "@/pages/admin/moviemanagement/ListMovies";
import AddMovies from "@/pages/admin/moviemanagement/AddMovies";
import Enquery from "@/pages/admin/customer/Enquery";
import EditTheatre from "@/pages/theatreowner/theatreManagement/EditTheatre";
import ShowRequest from '@/pages/admin/theatremanagement/ShowRequest';
import EditMovie from '@/pages/admin/moviemanagement/EditMovie';
import ShowTheatres from '@/pages/admin/theatremanagement/Showtheatres';
import { AdminRoute } from '@/pages/routes/ProtectedRoute';
import PendingRefund from '@/pages/admin/bookingmanagement/PendingRefund';
import ExcelDownloadComponent from '@/pages/admin/dashboard/ExcelDownloadComponent';
import ShowComplaints from '@/pages/admin/complaintsmanagement/ShowComplaints';
import RespondComplaint from '@/pages/admin/complaintsmanagement/RespondComplaint';

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
            <Route path='complaints' element={<ShowComplaints/>} />
            <Route path='complaint/action/:id' element={<RespondComplaint onBack={'/admin/complaints'} />} />
            
        </Routes>
      
    </div>
  )
}

export default Section
