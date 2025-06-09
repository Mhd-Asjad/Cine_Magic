import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TheatreDashboard from '@/pages/theatreowner/TheatreDashboard';
import ListTheatre from '@/pages/theatreowner/theatreManagement/ListTheatre';
import PendingTheatres from '@/pages/theatreowner/theatreManagement/PendingTheatres';
import AddScreen from '@/pages/theatreowner/theatreManagement/AddScreen';
import ShowScreen from '@/pages/theatreowner/theatreManagement/ShowScreen';
import AddTheatre from '@/pages/theatreowner/theatreManagement/AddTheatre';
import EditTheatre from '@/pages/theatreowner/theatreManagement/EditTheatre';
import SeatHome from '@/pages/theatreowner/seatManagement/SeatHome';
import LayoutCards from '@/pages/theatreowner/seatManagement/LayoutCards';
import Addshowtime from '@/pages/theatreowner/showmanagement/Addshowtime';
import EditShow from '@/pages/theatreowner/showmanagement/EditShow';
import { TheatreRoute } from '@/pages/routes/ProtectedRoute';
import ShowBookings from '@/pages/theatreowner/bookingmanagement/ShowBookings';
import TicketDetails from '@/pages/theatreowner/bookingmanagement/TicketDetails';

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
