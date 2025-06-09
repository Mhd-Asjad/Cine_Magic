import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Upcoming_Carousel() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
    useEffect(() => {
    fetchUpcomingMovies();
  }, []);

  const fetchUpcomingMovies = async () => {
    try {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ODExYWI5MTExYWRlZWMxN2UyMzk0Zjg1OTE3OTM4YiIsIm5iZiI6MTcyNTc3NDY1OS4xNTY5OTk4LCJzdWIiOiI2NmRkM2I0MzU0YWYwZTE3MGUzOGJlMWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.uOfHGjAWVEJgIZsds9hX1-hW7DoYtJVs9iupSj-OFdc'
        },
      };

      const response = await axios.get(
        'https://api.themoviedb.org/3/movie/upcoming?language=ml-IN',
        options
      );
      setMovies(response.data.results);
    } catch (e) {
      console.log('Error fetching movies', e);
    }
  };

  const prevIndex = (currentIndex - 1 + movies.length) % movies.length;
  const nextIndex = (currentIndex + 1) % movies.length;

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };
  return (
    
    <div className="w-full flex justify-center py-10 bg-gray-100">
      <div className="w-full max-w-6xl flex items-center">

        {/* Previous Thumbnail */}
        {movies.length > 0 && (
          <div
            onClick={() => goToSlide(prevIndex)}
            className="cursor-pointer flex-shrink-0 opacity-70 hover:opacity-100 transition-all duration-300 w-[80px] sm:w-[120px] md:w-[150px] lg:w-[180px]"
            >
            <img
              src={`https://image.tmdb.org/t/p/w300${movies[prevIndex].poster_path}`}
              alt={movies[prevIndex].title}
              className="w-full h-full object-cover rounded-lg shadow-md aspect-[2/3]"
            />
          </div>
        )}

        {movies.length > 0 && (
          <div className="flex-grow px-2 md:px-4">
            <img
              src={`https://image.tmdb.org/t/p/original${movies[currentIndex].backdrop_path}`}
              alt={movies[currentIndex].title}
              className="w-full h-full object-cover rounded-xl shadow-xl aspect-video"
            />
            <div className="mt-2 text-center font-semibold text-gray-800 text-sm md:text-lg">
              {movies[currentIndex].title}
            </div>
          </div>
        )}

        {/* Next Thumbnail */}
        {movies.length > 0 && (
          <div
            onClick={() => goToSlide(nextIndex)}
            className="cursor-pointer flex-shrink-0 opacity-70 hover:opacity-100 transition-all duration-300 w-[80px] sm:w-[120px] md:w-[150px] lg:w-[180px]"
            >
            <img
              src={`https://image.tmdb.org/t/p/w300${movies[nextIndex].poster_path}`}
              alt={movies[nextIndex].title}
              className="w-full  h-full object-cover rounded-lg shadow-md aspect-[2/3]"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Upcoming_Carousel;
