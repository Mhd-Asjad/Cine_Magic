import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../search/SearchBar';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { split } from 'postcss/lib/list';
import Upcomingmovies from './Upcomingmovies';
function MovieList({ movie }) {
  const navigate = useNavigate();
  const handleMovieSelect = (movieId) => {
    navigate(`/movie/${movieId}/details`)
  }
  
  return (  
    <div className="w-full bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative -mb-[18%] aspect-[2/3] flex justify-center">
        <img
          src={movie.poster}
          alt={`${movie.title} poster`}
          className="w-[79%] h-[80%] object-cover rounded cursor-pointer"
          onClick={() => handleMovieSelect(movie.id)}
        />
        {(() => {
          const releaseDate = new Date(movie.release_date)
          const today = new Date();
          const diffTime = today - releaseDate
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          if (diffDays < 0 || diffDays <= 7) {
            return (
              <span className="absolute top-4 left-8 bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium">
            
                new release
              </span>
            );
          }
          return null;
        })()}
      </div>

      <div className="ml-10 mb-6">
        <h3 className="font-medium text-lg text-gray-600 mb-1">{movie.title}</h3>
        <div className="text-gray-500 text-sm mb-3">
          <span className='flex items-center'>
            <span className='ml-1'>
              🎬 {movie.genre}
            </span>
          </span>
          <span className="flex items-center font-serif ml-1.5">
            <span className='ml-1 capitalize'>Language: {movie.language}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

const MovieGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedGenre , setSelectedGenre ] = useState('')
  const movies = useSelector((state) => state.movie.movies);
  const selectedCity = useSelector((state) => state.location.selectedCity);

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = movie.language.toLowerCase().includes(selectedLanguage.toLowerCase())
    console.log(movie.genre)
    const matchesGenres = movie.genre.toLowerCase().includes(selectedGenre.toLocaleLowerCase())
    return matchesSearch && matchesLanguage && matchesGenres ;
  });

  const uniqueGenres = [
    ...new Set(
      movies
        .flatMap(movie =>
          movie.genre
            .split(/[/,]/)           
            .map(g => g.trim())            
            .filter(Boolean)             
            .map(g => g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()) 
        )
    )
  ];

  const uniqueLanguages = [
    ...new Set(
      movies
      .flatMap((movie) => 
        movie.language
          .split(/[/,]/)
          .map(l => l.trim())
          .filter(Boolean)
          .map(l => l.charAt(0).toUpperCase() + l.slice(1).toLowerCase())

    ))];
  
  return (
    <div className="container mx-auto px-4 py-6 ">
      <div className="mb-6  flex justify-center">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <h2 className="text-2xl font-medium mb-6">
        Movies in {selectedCity || 'your city'}
      </h2>
      
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-64 p-6 rounded-lg bg-white mr-[4%]">
          <h2 className="text-lg font-semibold mb-4">Filter by Language</h2>
          <RadioGroup
            value={selectedLanguage}
            onValueChange={(value) => setSelectedLanguage(value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="all" />
              <Label htmlFor="all">All</Label>
            </div>
            {uniqueLanguages.map((lang, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={lang} id={lang} />
                <Label htmlFor={lang} className="capitalize">{lang}</Label>
              </div>
            ))}

    

              <h2 className='text-lg font-semibold mb-4' >Filter by genre</h2>
                <RadioGroup 
                  value={selectedGenre}
                  onValueChange={(value) => setSelectedGenre(value)}
              
                  className="space-y-2 text-lg"
                  
                  >
          
                  <div className='flex items-end space-x-2' >
                    <RadioGroupItem value=""  id="all"/>
                    <Label htmlFor="all" className="" >All</Label>
                    
                  </div>

                  {uniqueGenres.map((gen , indx) => (
                      <div key={indx} className="flex items-center space-x-2">
                        <RadioGroupItem value={gen} id={gen} />
                        <Label htmlFor={gen} className="capitalize">{gen}</Label>
                      </div>
                  ))}                  
              </RadioGroup>


          </RadioGroup>
        </div>
        
        <div className="flex-1 bg-white "> 
          {filteredMovies.length === 0 ? (
            <div className="text-gray-800 font-semibold  text-center py-10">No Movies available</div>
          ) : (
            <div className="grid grid-cols-1 mt-10 sm:grid-cols-2lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredMovies.map((movie) => (
                <MovieList key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>

      </div>

      < Upcomingmovies/>   

    </div>
  );
};

export default MovieGrid;