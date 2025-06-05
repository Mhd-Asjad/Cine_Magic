import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../search/SearchBar';
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Play, Calendar, Star, Heart, Clock, Eye, Sparkles } from 'lucide-react';
import Upcomingmovies from './Upcomingmovies';
function MovieList({ movie }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const navigate = useNavigate();
  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };
  const handleMovieSelect = (movieId) => {
    navigate(`/movie/${movieId}/details`)
  }


 return ( 
    <div 
      className="group relative bg-gradient-to-brrounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2 cursor-pointer border border-slate-700/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => handleMovieSelect(movie.id)}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Poster Container */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.poster}
          alt={`${movie.title} poster`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* New Release Badge */}
        {/* {isNewRelease() && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 animate-pulse">
              <Sparkles className="w-3 h-3" />
              <span>NEW</span>
            </div>
          </div>
        )} */}
        
        {/* Rating Badge */}
        {/* <div className="absolute top-3 right-3 z-10">
          <div className={`${getRatingColor(movie.rating)} backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center space-x-1`}>
            <Star className="w-3 h-3 fill-current" />
            <span>{movie.rating}</span>
          </div>
        </div> */}
        
        {/* Hover Overlay with Actions */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex space-x-3">
            <button 
              className="bg-white/20 backdrop-blur-sm p-3 rounded-full text-white hover:bg-white/30 transition-all duration-200 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                handleMovieSelect(movie.id);
              }}
            >
              <Play className="w-5 h-5 fill-current" />
            </button>
            <button 
              className={`backdrop-blur-sm p-3 rounded-full transition-all duration-200 hover:scale-110 ${
                isLiked 
                  ? 'bg-red-500/30 text-red-400' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              onClick={handleLike}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Movie Details */}
      <div className="p-5 space-y-3 relative z-10">
        <div className="space-y-2">
          <h3 className="font-bold text-lg group-hover:bg-clip-text transition-all duration-300 line-clamp-2">
            {movie.title}
          </h3>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 flex items-center space-x-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>{movie.genre}</span>
            </span>
            <span className="text-gray-500 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{movie.duration}m</span>
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400 capitalize flex items-center space-x-1">
              <span className="text-blue-400">🌐</span>
              <span>{movie.language}</span>
            </span>
            <span className="text-gray-500 flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(movie.release_date).getFullYear()}</span>
            </span>
          </div>
        </div>
        
        <div className={`flex items-center justify-between pt-3 border-t border-slate-700/50 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'}`}>
          <div className="flex mx-auto space-x-2 text-gray-400">
            <Eye className="w-4 h-4" />
            <span className="text-xs">book tickets</span>
          </div>
          <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-gray-500 rounded-full"></div>
        </div>
      </div>
      
      {/* <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-white/20 rounded-full blur-xl animate-ping"></div>
        <div className="absolute top-1/2 right-4 w-2 h-2 bg-purple-400/50 rounded-full blur-sm animate-pulse delay-300"></div>
        <div className="absolute bottom-4 left-1/3 w-3 h-3 bg-pink-400/30 rounded-full blur-sm animate-pulse delay-700"></div>
      </div> */}
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
      
     
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-64 p-6 rounded-lg bg-white mr-[4%]">
          <h2 className="text-lg font-semibold mb-4">Language</h2>
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

    

              <h2 className='text-lg font-semibold mb-4' >Genre</h2>
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
        <div className="bg-slate-100/50 backdrop-blur-sm rounded-3xl p-8 border shadow-md">
          <div className='ml-2 mb-3 text-xl'>

          <h1 className='font-semibold' >movies in {selectedCity} </h1>
          </div>
          {filteredMovies.length === 0 ? (
            <div className="text-center  w-full py-20">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                <Eye className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Movies Available</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
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