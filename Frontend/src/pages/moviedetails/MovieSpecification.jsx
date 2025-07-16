import React, { useState , useEffect } from 'react'
import Nav from '../../components/navbar/Nav'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Footer from '../../components/footer/Footer'
import CastCards from './CastCards'
import Upcomingmovies from '@/components/moviecards/Upcomingmovies'
import apiMovies from '@/axios/Moviesapi'
import MovieReviews from './MovieReviews'
import { BookCheck } from 'lucide-react'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w780';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
function MovieSpecification( ) {
  const {id} = useParams()
  const [movie , setMovies] = useState(null);
  const navigate = useNavigate();
  
  
  
  
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await apiMovies.get(`/movie_details/${id}/`);
        console.log(response.data)
        setMovies(response.data)

      }catch(error) { 
        console.log('error fetching movie spec',error)
      }
    }
    fetchMovies()
  },[id ])

  useEffect(() => {
    
    const fetchTMDBData = async () => {
      if (!movie || movie.movie_id) return;
  
      const tmdbParams = {
        api_key: TMDB_API_KEY,
        query: movie.title,
        include_adult: false,
        language: 'ml',
        region: 'IN',
        page: 1
      };
      console.log('tmdb params', tmdbParams)
      try {
        const tmdbResponse = await axios.get(
          "https://api.themoviedb.org/3/search/movie",
          { params: tmdbParams }
        );
  
        const results = tmdbResponse.data.results;
        if (results && results.length > 0) {
          const tmdbMovie = results[0];
          const backdropPath = tmdbMovie.backdrop_path || tmdbMovie.poster_path;
          const backdropUrl = backdropPath ? `https://image.tmdb.org/t/p/original${backdropPath}` : null;
  
          setMovies((prev) => ({
            ...prev,
            movie_id: tmdbMovie.id,
            bg_image: backdropUrl,
          }));
        }
  
      } catch (error) {
        console.error("Failed to fetch TMDB data:", error);
      }
    }
    fetchTMDBData()
  }, [id , movie]);

  const handleChange = () => {
    navigate(`/available-show-details/${id}`)
  }


  if (!movie) {
    return(
      <div className="flex justify-center items-center bg-gray-100 min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>

    )
  }
  return (
    <div>

      <Nav />

      <div className="bg-gray-100 ">

  
        {movie && (
          <div className="relative w-full h-auto min-h-[400px] md:h-[600px]">
            <img
              src={`${IMAGE_BASE_URL}${movie.bg_image}`}
              alt="Backdrop"
              className="w-full h-full object-cover opacity-30 absolute inset-0"
            />
            
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-0"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start justify-center max-w-7xl mx-auto px-4 py-8 gap-8">
              
              <div className="w-full max-w-[250px] md:max-w-[300px] flex-shrink-0">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-auto max-h-[320px] object-cover rounded-lg shadow-xl"
                />
              </div>

              <div className="flex flex-col justify-start w-full max-w-2xl ">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>

                <div className="flex flex-wrap items-center gap-2 text-base sm:text-lg mb-2">
                  <span className="font-semibold bg-gray-200 text-black outline outline-1 outline-gray-400 rounded-sm px-2">2D</span>
                  <span>{movie.language}</span>
                </div>

                <ul className="text-sm sm:text-base space-y-1 mb-4">
                  <li><span className="font-semibold">{movie.duration} minutes</span></li>
                  <li>{movie.genre}</li>
                  <li>{movie.release_date}</li>
                </ul>

                <div className="mt-2">
                  <button 
                    onClick={handleChange}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 px-6 py-3 rounded-lg font-medium transition-all text-white"
                  >
                    <BookCheck className="w-5 h-5" />
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {movie && (
        <div className="max-w-7xl mx-auto px-4 mt-10 ">
          <div className="p-6 rounded-lg ">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">About the Movie</h2>
            <p className="text-gray-700 leading-relaxed">{movie.description}</p>
          </div>



        </div>
        
      )}

      <div className="max-w-7xl mx-auto px-4 mt-10">

        <div className="mt-10">
          <CastCards movie_id={movie.movie_id} />
        </div>

      </div>

        <div  className="max-w-7xl mx-auto px-4 mt-10" >

          <MovieReviews movie_id={id} />
        </div>

        <Upcomingmovies/>
        <Footer />
        
      </div>
    </div>
  )
}  

export default MovieSpecification
