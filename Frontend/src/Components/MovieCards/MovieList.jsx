import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function MovieList({ movie }) {
  const navigate = useNavigate();
  const handleMovieSelect = (movieId) => {
    navigate(`/movie/${movieId}/details`)

  }
  return (
    <div className="w-full bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-[2/3] flex justify-center">
        <img
          src={movie.poster}
          alt={`${movie.title} poster`}
          className="w-[89%] h-[89%] object-cover rounded cursor-pointer"
          onClick={() => handleMovieSelect(movie.id)}
        />
        <span className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-md text-sm font-medium">
          New Release
        </span>
      </div>

      <div className="ml-4 mb-6">
        <h3 className="font-medium text-lg">{movie.title}</h3>
        <div className="text-gray-500 text-sm mb-3 flex items-center">
          <span>{movie.genre}</span>
          <span className="mx-2"></span>
          <span>{movie.language}</span>
        </div>

      </div>
    </div>
  );
}

const MovieGrid = () => {
  const movies = useSelector((state) => state.movie.movies || []);
  const selectedCity = useSelector((state) => state.location.selectedCity);

  return (
    <div className="w-auto container ml-[25%] px-4 py-6">
      <h2 className="text-2xl font-medium mb-6">
        Movies in {selectedCity || 'your city'}
      </h2>
      {movies.length === 0 ? (
        <p className="text-gray-500 text-center">No Movies available</p>
      ) : (
        <div className="grid w-[85%] grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieList key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieGrid;
