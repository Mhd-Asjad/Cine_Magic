import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TheatreDashboard from '@/Pages/Theatreowner/TheatreDashboard';
import ListTheatre from '@/Pages/Theatreowner/TheatreManagement/ListTheatre';
import PendingTheatres from '@/Pages/Theatreowner/TheatreManagement/pendingTheatres';
import AddScreen from '@/Pages/Theatreowner/TheatreManagement/AddScreen';
import ShowScreen from '@/Pages/Theatreowner/TheatreManagement/ShowScreen';
import AddTheatre from '@/Pages/Theatreowner/TheatreManagement/AddTheatre';
import EditTheatre from '@/Pages/Theatreowner/TheatreManagement/EditTheatre';
import SeatHome from '@/Pages/Theatreowner/SeatManagement/SeatHome';
import LayoutCards from '@/Pages/Theatreowner/SeatManagement/LayoutCards';
import Addshowtime from '@/Pages/Theatreowner/ShowManagement/Addshowtime';
import EditShow from '@/Pages/Theatreowner/ShowManagement/EditShow';
import { TheatreRoute } from '@/Pages/Routes/ProtectedRoute';
import ShowBookings from '@/Pages/Theatreowner/BookingManagement/ShowBookings';
import TicketDetails from '@/Pages/Theatreowner/BookingManagement/TicketDetails';
function Sections() {
    return (
        <div>
            
            <Routes>
                <Route path="dashboard" element={<TheatreRoute><TheatreDashboard/></TheatreRoute>}/>
                <Route path="add-theatre" element={<TheatreRoute> <AddTheatre/> </TheatreRoute>} />
                <Route path="theatre-confimation" element={<TheatreRoute><PendingTheatres/></TheatreRoute>} />
                <Route path=":id/add-screen" element={<TheatreRoute><AddScreen/></TheatreRoute>}/>
                <Route path='list-theatre' element={<TheatreRoute><ListTheatre/></TheatreRoute>} />
                <Route path=':id/screens' element={<TheatreRoute><ShowScreen/></TheatreRoute>} />
                <Route path='add-showtime/:theatreId/:screenId' element={<TheatreRoute><Addshowtime/></TheatreRoute>} />
                <Route path='edit-show/:id' element={<TheatreRoute><EditShow/></TheatreRoute>} />
                <Route path='list-theatre/add-theatre' element={<TheatreRoute><AddTheatre/></TheatreRoute>}  />
                <Route path=':id/edit-theatre' element={<TheatreRoute><EditTheatre/></TheatreRoute>} />
                <Route path="seats-layout" element={<TheatreRoute><SeatHome/></TheatreRoute>} />
                <Route path="cards/" element={<TheatreRoute><LayoutCards/></TheatreRoute>} />
                <Route path='theatres/bookings' element={<TheatreRoute><ShowBookings/></TheatreRoute>} />
                <Route path='show/booking/:id' element={<TheatreRoute><TicketDetails/></TheatreRoute>} />

            </Routes>

        </div>
    )
}   

export default Sections
