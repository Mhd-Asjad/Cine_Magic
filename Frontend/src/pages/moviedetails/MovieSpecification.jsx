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

function MovieSpecification( ) {
  const {id} = useParams()
  const [movie , setMovies] = useState(null);
  const [error , setError] = useState('') ;
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
  },[id])

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
        <div className="relative w-full h-[400px] md:h-[600px]">
          <img
            src={`${IMAGE_BASE_URL}${movie.bg_image}`} 
            alt="Backdrop" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent"></div>
  
          <div className="absolute inset-0 z-10 flex flex-col md:flex-row items-center justify-center max-w-7xl px-4">
            <div className="w-full md:w-64 mb-6 md:mb-0 md:mr-8">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-[500px] h-[350px] object-cover rounded-lg shadow-xl"
              />
            </div>
  
            <div className="text-black max-w-xl">
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
              <p className='text-xl' ><span className="font-semibold bg-gray-100 outline outline-1 outline-gray-400 rounded-sm px-1">2D</span> {movie.language}</p>
              <p className="text-sm text-gray-200 italic"></p>
              <ul>
                <li>
                  <span className='font-semibold'>{movie.duration}  minutes</span>
                </li>
                <li>{movie.genre}</li>
                <li>{movie.release_date}</li>
              </ul>
              <p className="mt-2"><span className="font-bold"></span> </p>
          
              <button 
                onClick={handleChange} 
                className="flex items-center space-x-2 bg-orange-400 hover:bg-orange-400/80 px-6 py-3 rounded-lg font-medium transition-colors">
                <BookCheck className='w-5 h-5' />
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
  
      {movie && (
        <div className="max-w-7xl mx-auto px-4 mt-10">
          <div className="p-6 shadow-md rounded-lg bg-white">
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
