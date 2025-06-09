import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Section from './Section';
import { Outlet } from 'react-router-dom';

function Admin_Pages() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1 ml-64">
          <Navbar />
        

        <div className="flex p-5 bg-gray-100 w-full h-full justify-center items-center"> 
          <Section />
        </div>
      </div>
    </div>
  );
}

export default Admin_Pages;
