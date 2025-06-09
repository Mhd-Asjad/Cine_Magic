import React, { useEffect, useRef ,  useState } from 'react'
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Upcomingmovies() {
    const [upcomingMovies , setUpcomingMovies] = useState([]);
    const [ isLeftVisible , setIsLeftVisible ] = useState(false);
    const [isRightVisible, setIsRightVisible] = useState(true);
    const scrollContainerRef = useRef(null);
    const navigate = useNavigate();
    const TMDB_API = import.meta.env.TMDB_API_KEY
    useEffect(()=> {
        const fetchUpcomingMovies = async () => {
        try {
            const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ODExYWI5MTExYWRlZWMxN2UyMzk0Zjg1OTE3OTM4YiIsIm5iZiI6MTcyNTc3NDY1OS4xNTY5OTk4LCJzdWIiOiI2NmRkM2I0MzU0YWYwZTE3MGUzOGJlMWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.uOfHGjAWVEJgIZsds9hX1-hW7DoYtJVs9iupSj-OFdc'
            },
            params : {
                language : 'ml-IN',
                with_original_language : 'ml',
                sort_by : 'release_date.asc',
                'release_date.gte' : new Date().toISOString().split('T')[0],
            }
            };
    
            const response = await axios.get(
            'https://api.themoviedb.org/3/discover/movie',
            options
            );
            setUpcomingMovies(response.data.results);
        } catch (e) {
            console.log('Error fetching movies', e);
        }
        };
        fetchUpcomingMovies()
    },[])

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
          const { current } = scrollContainerRef;
          const scrollAmount = direction === 'left' ? -280 : 280;
          current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          
          setTimeout(() => {
            setIsLeftVisible(current.scrollLeft > 0);
            setIsRightVisible(current.scrollLeft < current.scrollWidth - current.clientWidth - 10);
          }, 300);
        }
      };
    
      const handleScroll = () => {
        const { current } = scrollContainerRef;
        if (current) {
          setIsLeftVisible(current.scrollLeft > 0);
          setIsRightVisible(current.scrollLeft < current.scrollWidth - current.clientWidth - 10);
        }
      };
    
    console.log(upcomingMovies , 'movies latest ')

    return (
        <div className="w-full max-w-6xl mx-auto mb-7 mt-7 py-4 px-3 bg-white rounded-lg">
          <div className="flex items-center justify-between px-2 py-4">
            <h2 className="text-lg font-medium text-gray-800">Upcoming Movies</h2>
            <a href="#" className="text-sm text-blue-500 hover:underline">View All</a>
          </div>
          
          <div className="relative">
            <div 
              className="overflow-x-auto scrollbar-hide pl-2"
              ref={scrollContainerRef}
              onScroll={handleScroll}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex pb-6 space-x-4">
                {upcomingMovies.slice(0,15).map((movie) => (
                  <div key={movie.id} className="flex-shrink-0 w-52 rounded-md overflow-hidden bg-white shadow-sm">
                    <div className="relative">
                      <img 
                        src={ movie.poster_path ? `https://image.tmdb.org/t/p/w300/${movie.poster_path}/` : `https://image.tmdb.org/t/p/w300/${movie.backdrop_path}/` } 
                        alt={movie.title} 
                        className="w-full h-64 object-cover rounded-md cursor-pointer"
                        onClick={() => navigate(`/movie/${movie.id}`)}
                      />
                      <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-t from-black to-transparent">
                        <div className="text-white text-xs">
                          <div className="font-medium">Release Date</div>
                          <div className="font-bold">{movie.release_date}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <h3 className="font-medium text-base text-gray-800">{movie.title}</h3>
                      <p className="text-gray-600 text-xs">{movie.language}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {isRightVisible && (
              <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md z-10"
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            )}
            
            {isLeftVisible && (
              <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md z-10"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
            )}
          </div>
    
          <style jsx>{`
            /* Hide scrollbar for Chrome, Safari and Opera */
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      );    
}

export default Upcomingmovies
