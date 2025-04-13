import React, { useState , useEffect } from 'react'
import Nav from '../../Components/Navbar/Nav'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Footer from '../../Components/Footer/footer'
import CastCards from './CastCards'

function MovieSpecification() {
  const {id} = useParams()
  const [movie , setMovies] = useState(null);
  const [error , setError] = useState('') ;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/movies/movie_details/${id}/`);
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
  console.log(movie)
  return (
    <div className="bg-gray-100 min-h-screen">
    <Nav />
    {error && (
      <div className="text-center text-red-600 font-bold mt-5">{error}</div>
    )}
    {movie && (
      <div className="max-w-7xl mx-auto mb-5 shadow-lg rounded-lg overflow-hidden mt-10">
        <div className="flex flex-col w-[60%] h-[60%] md:flex-row">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full md:w-1/3 object-cover"
          />
  
          <div className="p-6 flex flex-col justify-between">
            <h1 className="text-3xl font-bold text-gray-800">{movie.title}</h1>
            <p className="text-gray-600 mt-2 italic">{movie.genre}</p>
            <p className="mt-4">
              <span className="font-semibold">Release Date:</span> {movie.release_date}
            </p>
            <p className="font-mono">
              <span className="font-semibold">Duration:</span> {movie.duration} minutes
            </p>
            <p className="">
              <span className="font-semibold">Language:</span> {movie.language}
            </p>
            <button onClick={handleChange} className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-lg">
              Book Now
            </button>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">About the Movie</h2>
          <p className="text-gray-700 leading-relaxed">{movie.description}</p>
        </div>

        <CastCards movie_id={movie.movie_id} />
{/* 
        {movie.cities ? (
          <div className="p-7 mb-9">
            <h2 className="text-2xl font-semibold mb-4">Available in Cities</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {movie.cities.map((city, index) => (
                <li
                  key={index}
                  className="bg-gray-200 text-gray-800 w-[30%] py-2 px-4 rounded-lg text-center"
                >
                  {city}
                </li>
              ))}
            </ul>
          </div>
        ) : (

          <p > movies are just not found </p>
        )} */}
      <br /><br />
      </div>
    )}
    <Footer/>
  </div>
  )
}

export default MovieSpecification
