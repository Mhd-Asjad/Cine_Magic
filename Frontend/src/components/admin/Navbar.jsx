import react from 'react';
import Logout from './Logout';

function Navbar() {
    return(


            <nav className='fixed top-0 left-64 right-0 h-16 flex items-center justify-between px-4 sm:px-6 bg-white shadow z-50 w-[calc(100%-16rem)]'>
            <div>
                <input type="text"
                placeholder='Search...'
                className='w-80 p-2 rounded-md'
                // onChange={(e) => onSearch(e.target.value) }
                />
            </div>

            <div className="flex justify-center items-center border rounded px-2 py-1">
                <Logout role='admin' />
                
            </div>

        </nav>
    )
}

export default Navbar