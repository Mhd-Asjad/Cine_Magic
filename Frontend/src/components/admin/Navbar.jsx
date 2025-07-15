import react from 'react';
import Logout from './Logout';

function Navbar() {
    return(
        <nav className='w-full h-16 flex items-center justify-end px-4 sm:px-6 bg-white shadow-md z-40'> 
            <div className="flex items-center justify-end border rounded-md px-2 py-1"> 
                <Logout role='admin' /> 
            </div> 
        </nav> 

    )
}

export default Navbar