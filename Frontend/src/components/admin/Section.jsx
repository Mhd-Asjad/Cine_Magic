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
import AdminSettings from '@/pages/admin/Settings';
function Section() {
  return (
    <div>
        <Routes>
            <Route path="dashboard" element={<AdminRoute> <Dashboard /></AdminRoute>}/>
            <Route path='download/reports' element={<AdminRoute><ExcelDownloadComponent/></AdminRoute>} />
            <Route path="customers" element={<AdminRoute><CustomerManagement /></AdminRoute>} />
            <Route path="enquery" element={<AdminRoute> <Enquery /> </AdminRoute>} />
            <Route path="movies" element={<AdminRoute><ListMovies /></AdminRoute>} />
            <Route path="movies/:movie_id/edit" element={<AdminRoute><EditMovie/></AdminRoute>} />
            <Route path='add-movies' element={<AdminRoute><AddMovies /></AdminRoute>} />
            <Route path="theatres/:theatreId/edit" element={<AdminRoute><EditTheatre /></AdminRoute>} />
            <Route path='pending-theatres' element={<AdminRoute><ShowRequest/></AdminRoute>} />
            <Route path='showtheatres' element={<AdminRoute><ShowTheatres/></AdminRoute>} />
            <Route path='bookings' element={<AdminRoute><PendingRefund/></AdminRoute>} ></Route>
            <Route path='complaints' element={<ShowComplaints/>} />
            <Route path='complaint/action/:id' element={<AdminRoute><RespondComplaint onBack={'/admin/complaints'} /></AdminRoute>} />
            <Route path='settings' element={<AdminRoute><AdminSettings/></AdminRoute>} />
        </Routes>
    </div>
  )
}

export default Section
