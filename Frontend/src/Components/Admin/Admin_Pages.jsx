import React from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Section from './Section'

function Admin_Pages() {
  return (
    
    <div className='grid min-h-screen'>

      <Sidebar/>
      <div className="flex flex-col w-full">
        <div className="sticky top-0 bg-white shadow-md z-10">
          <Navbar />
        </div>

        <div className="flex p-5 bg-gray-100 h-full justify-center">
          <Section />
        </div>
      </div>
    </div>

  )
}

export default Admin_Pages
