import React from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white h-full fixed top-0 left-0 shadow-lg">
        <div className="py-6 px-4 text-xl font-semibold border-b border-gray-700" >
            <Link to="/dashboard">
                Admin Dashboard
            </Link>
        </div>
        <nav className="mt-6">
            <ul className="space-y-4">
                <li>
                    <Link to="/customers" className="block py-2 px-4 hover:bg-gray-700 rounded-md">
                        Customers
                    </Link>
                </li>
                
                <li>
                    <Link to="/dashboard/movies" className="block py-2 px-4 hover:bg-gray-700 rounded-md">
                        Movies
                    </Link>
                </li>

                <li>
                    <Link to="/cities" className="block py-2 px-4 hover:bg-gray-700 rounded-md">
                        Locations and Theatre
                    </Link>
                </li>
                
            </ul>
        </nav>
    </div>
  )
}

export default Sidebar
