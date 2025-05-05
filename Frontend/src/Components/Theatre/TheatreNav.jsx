import React , { useState } from 'react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import axios from 'axios'
import logo from '../../assets/logopic2.png'
import Logout from '../Admin/Logout';

const TheatreNav = () => {
  const [ movies , setMovies ] = useState([]);
  const fetchMovies = async () => {
    try{
      const res = await axios.get('http://127.0.0.1:8000/theatre_owner/fetchmovies/')
      setMovies(res.data)
    }catch(e) {
      console.log(e.response)
    }
  }
  console.log(movies)
  return (
    <nav className="bg-gray-200 shadow-md">
      <div className="container mx-auto px-4 sticky-top">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center justify-start px-4">
            {/* <img src={logo} alt="Cinema Logo" className="h-20 w-auto" /> */}
          </div>
            <div className="hidden md:flex flex-1 justify-start px-40 space-x-10 font-bold">
                <a className="text-black hover:text-red-600">
                  Home
                </a>
    

            <HoverCard>
              <HoverCardTrigger asChild>
                <a onMouseEnter={fetchMovies} className="text-black hover:text-red-600 cursor-pointer">
                  Movies
                </a>
              </HoverCardTrigger>
              <HoverCardContent className="w-[1200px] h-[780px] p-10 ">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">current running Movies</h4>

                  <div className="grid grid-cols-3 gap-4">
                    {movies.slice(0,9).map((movie, index) => (
                      <div key={index} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100">
                        <h5 className="font-medium text-sm">{movie.title}</h5>
                        <div className="text-xs text-gray-600 mt-1 space-y-1">
                          <img src={movie.poster} alt="poster" className='h-[21%] w-[21%] '/>
                          <p>Language: {movie.language}</p>
                          <p>Duration: {movie.duration}</p>
                          <p>Release: {new Date(movie.release_date).toLocaleDateString()}</p>
                          
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            
          </div>
          {/* <div className='space-y-4' >


          <div className='grid grid-cols-4 gap-4' >


            <a className="text-black hover:text-red-600 cursor-pointer" >
                    profile
            </a>
          </div>
          </div> */}

          <button className='items-center border rounded px-2 py-1'>

            <Logout role="theatre" />
            
          </button>
        </div>
      </div>
    </nav>
  );
};

export default TheatreNav
