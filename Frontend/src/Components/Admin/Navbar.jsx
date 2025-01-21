import react from 'react';
import Logout from './Logout';

function Navbar() {
    return(


        <nav className='flex fixed top-0 right-0 left-64 h-16 items-center justify-between px-6 bg-white shadow z-50' >
            <div>
                <input type="text"
                placeholder='Search...'
                className='w-80 p-2 rounded-md'
                // onChange={(e) => onSearch(e.target.value) }
                />
            </div>

            <div className="flex justify-center items-center border rounded px-2 py-1">
                <Logout/>
                
            </div>

        </nav>
    )
}

export default Navbar