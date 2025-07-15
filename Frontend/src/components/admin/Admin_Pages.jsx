import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Section from './Section';
import { Outlet } from 'react-router-dom';

function Admin_Pages() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <Sidebar />
        </div>
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex-shrink-0">
          <Navbar />
        </div>
        
        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Section />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Admin_Pages;
