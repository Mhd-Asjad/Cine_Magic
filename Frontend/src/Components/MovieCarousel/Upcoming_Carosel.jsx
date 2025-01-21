import React, { useEffect, useState } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';
import axios from 'axios';
function Upcoming_Carosel() {

  const [ movies , setMovies ] = useState([]);
  useEffect(() => {
    fetchUpcomingMovies()
  },[])

  const fetchUpcomingMovies = async () => {

    try {

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ODExYWI5MTExYWRlZWMxN2UyMzk0Zjg1OTE3OTM4YiIsIm5iZiI6MTcyNTc3NDY1OS4xNTY5OTk4LCJzdWIiOiI2NmRkM2I0MzU0YWYwZTE3MGUzOGJlMWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.uOfHGjAWVEJgIZsds9hX1-hW7DoYtJVs9iupSj-OFdc'
        }
      };

      const response = await axios.get('https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1',options)
      setMovies(response.data.results)

    }catch(e){
      console.log('error fetching movies',e)
    }

  };



  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? movies.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === movies.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const prevIndex = (currentIndex - 1 + movies.length) % movies.length;
  const nextIndex = (currentIndex + 1) % movies.length;

  return (

    <div className="max-w-[968px] max-h-[868px] mx-auto w-full py-16 px-4 relative group">
      <h1 className='flex mb-4 justify-center font-bold' >Upcoming shows</h1>
      <div
          style={{
            backgroundImage: movies[currentIndex]?.backdrop_path
              ? `url(https://image.tmdb.org/t/p/w500${movies[currentIndex].backdrop_path})`
              : 'url(https://via.placeholder.com/500x300?text=No+Image+Available)',
          }}
        className="w-full h-[300px] sm:h-[400px] lg:h-[285px] rounded-2xl bg-center bg-cover duration-500"
      ></div>
      <div className="flex justify-center py-2 mt-4">
        {movies.map((movie, slideIndex) => (
          <div
            key={movie.id}
            className={`cursor-pointer text-3xl ${slideIndex === currentIndex ? 'text-black' : 'text-gray-400'}` }
            onClick={() => setCurrentIndex(slideIndex)}
          >
            <RxDotFilled size={24} />
          </div>
        ))}
      </div>

      <div
        style={{
          backgroundImage: movies[prevIndex]?.backdrop_path
            ? `url(https://image.tmdb.org/t/p/w500${movies[prevIndex].backdrop_path})`
            : 'url(https://via.placeholder.com/500x300?text=No+Image+Available)',
        }}        
        className="absolute top-1/2 -translate-y-1/2 left-[-250px] w-[250px] h-[220px] rounded-md bg-center bg-cover duration-500 opacity-80 hover:opacity-90 "
      >
      <div
        className="hidden group-hover:block absolute top-[50%] -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-white text-black shadow-md cursor-pointer"
        onClick={prevSlide}
      >
        <BsChevronCompactLeft size={30} />
      </div>
      </div>

      <div
        style={{
          backgroundImage: movies[nextIndex]?.backdrop_path
            ? `url(https://image.tmdb.org/t/p/w500${movies[nextIndex].backdrop_path})`
            : 'url(https://via.placeholder.com/500x300?text=No+Image+Available)',
        }}        
        className="absolute k top-1/2 -translate-y-1/2 right-[-280px] w-[280px] h-[220px] rounded-md bg-center bg-cover duration-500 opacity-80 hover:opacity-90"
      >
      <div
        className="hidden group-hover:block absolute top-[50%] -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-white text-black cursor-pointer"
        onClick={nextSlide}
      >
        <BsChevronCompactRight size={30} />
      </div>
      </div>
    </div>
  );
}

export default Upcoming_Carosel;
