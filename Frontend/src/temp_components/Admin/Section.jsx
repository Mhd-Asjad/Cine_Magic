import React from 'react'
import {BrowserRouter as Router , Route , Routes} from 'react-router-dom'
import PrivateRoute from '@/pages/routes/PrivateRoute'
import Dashboard from '@/pages/admin/Dashboard/Dashboard';
import CustomerManagement from '@/pages/admin/Customer/CustomerManagement';
import ListMovies from "@/pages/admin/MovieManagement/ListMovies";
import AddMovies from "@/pages/admin/MovieManagement/AddMovies";
import Enquery from "@/pages/admin/Customer/Enquery";
import EditTheatre from "@/pages/theatreowner/theatreManagement/EditTheatre";
import ShowRequest from '@/pages/admin/TheatreManagement/ShowRequest';
import EditMovie from '@/pages/admin/MovieManagement/EditMovie';
import ShowTheatres from '@/pages/admin/TheatreManagement/Showtheatres';
import { AdminRoute } from '@/pages/routes/ProtectedRoute';
import PendingRefund from '@/pages/admin/BookingManagement/PendingRefund';
import ExcelDownloadComponent from '@/pages/admin/Dashboard/ExcelDownloadComponent';
import ShowComplaints from '@/pages/admin/ComplaintsManagement/ShowComplaints';
import RespondComplaint from '@/pages/admin/ComplaintsManagement/RespondComplaint';

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
