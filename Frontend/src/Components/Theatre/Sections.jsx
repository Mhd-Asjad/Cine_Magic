import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TheatreDashboard from '@/Pages/Theatreowner/TheatreDashboard';
import ListTheatre from '@/Pages/Theatreowner/TheatreManagement/ListTheatre';
import PrivateRoute from '@/Pages/Theatreowner/Routes/PrivateRoute';
import PendingTheatres from '@/Pages/Theatreowner/TheatreManagement/pendingTheatres';
import AddScreen from '@/Pages/Theatreowner/TheatreManagement/AddScreen';
import ShowScreen from '@/Pages/Theatreowner/TheatreManagement/ShowScreen';
import AddTheatre from '@/Pages/Theatreowner/TheatreManagement/AddTheatre';
import EditTheatre from '@/Pages/Theatreowner/TheatreManagement/EditTheatre';
function Sections() {
    return (
        <div>
            <Routes>
                <Route path="dashboard" element={<PrivateRoute> <TheatreDashboard/></PrivateRoute>}/>
                <Route path="add-theatre" element={<PrivateRoute> <AddTheatre/> </PrivateRoute>} />
                <Route path="theatre-confimation" element={<PrivateRoute><PendingTheatres/></PrivateRoute>} />
                <Route path=":id/add-screen" element={<PrivateRoute><AddScreen/></PrivateRoute>}/>
                <Route path='list-theatre' element={<PrivateRoute><ListTheatre/></PrivateRoute>} />
                <Route path=':id/screens' element={<ShowScreen/>} />
                <Route path='list-theatre/add-theatre' element={<PrivateRoute><AddTheatre/></PrivateRoute>}  />
                <Route path=':id/edit-theatre' element={<EditTheatre/>} />
            </Routes>

        </div>
    )
}

export default Sections
