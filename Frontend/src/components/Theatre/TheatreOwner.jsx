import React, { useState } from "react";
import TheatreNav from "./TheatreNav";
import Layout from "./Layout";
import Sections from "./Sections";

const TheatreOwner = () => {
  return (
    <div className="grid grid-cols-[auto,1fr] min-h-screen">
        <Layout />

      <div className="flex flex-col w-full">
        <div className="sticky top-0 bg-white shadow-md z-10">
          <TheatreNav />
        </div>

        <div className="flex p-5 bg-gray-100 h-full justify-center">
          <Sections />
        </div>
      </div>
    </div>
  );
};

export default  TheatreOwner;