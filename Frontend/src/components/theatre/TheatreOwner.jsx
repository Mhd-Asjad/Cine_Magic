import React, { useState } from "react";
import TheatreNav from "./TheatreNav";
import Layout from "./Layout";
import Sections from "./Sections";

const TheatreOwner = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <Layout />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Navbar */}
        <div className="flex-shrink-0">
          <TheatreNav />
        </div>
        
        {/* Main content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Sections />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


export default  TheatreOwner;