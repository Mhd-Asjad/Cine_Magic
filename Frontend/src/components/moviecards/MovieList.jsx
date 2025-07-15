import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../search/SearchBar';
import { Label } from "@/components/ui/label"
import { Play, Calendar, Filter, Heart, Clock, Eye, X , Globe , BookOpen , Check } from 'lucide-react';
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
      <div className="relative aspect-[2/2] overflow-hidden">
        <img
          src={movie.poster}
          alt={`${movie.title} poster`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        
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

const MovieFilterModal = ({ 
  isOpen, 
  onClose, 
  movies, 
  selectedLanguage, 
  setSelectedLanguage, 
  selectedGenre, 
  setSelectedGenre,
  sortOrder,
  setSortOrder 
}) => {
  if (!isOpen) return null;

  // Extract unique languages from movies
  const uniqueLanguages = [
    ...new Set(
      movies
        .flatMap((movie) => 
          movie.language
            .split(/[/,]/)
            .map(l => l.trim())
            .filter(Boolean)
            .map(l => l.charAt(0).toUpperCase() + l.slice(1).toLowerCase())
        )
    )
  ];

  // Extract unique genres from movies
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

  const CustomSelect = ({ value, onChange, options, placeholder, label }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white text-slate-700 text-sm"
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => (
          <option key={index} value={typeof option === 'object' ? option.value : option} className="capitalize">
            {typeof option === 'object' ? option.label : option}
          </option>
        ))}
      </select>
    </div>
  );

  const SortOption = ({ value, label, selectedValue, onChange }) => (
    <div 
      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-slate-50 ${
        selectedValue === value ? 'bg-slate-100 ring-2 ring-slate-300' : ''
      }`}
      onClick={() => onChange(value)}
    >
      <div 
        className={`relative flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all duration-200 ${
          selectedValue === value 
            ? 'border-slate-500 bg-slate-500 shadow-lg shadow-slate-500/25' 
            : 'border-gray-300 hover:border-slate-400 bg-white'
        }`}
      >
        {selectedValue === value && <Check className="w-3 h-3 text-white" />}
      </div>
      <label 
        className={`cursor-pointer transition-colors duration-200 ${
          selectedValue === value ? 'text-slate-700 font-medium' : 'text-gray-700'
        }`}
      >
        {label}
      </label>
    </div>
  );

  const FilterSection = ({ title, icon: Icon, children }) => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Icon className="w-4 h-4 text-slate-600" />
        <h3 className="text-sm font-medium text-slate-800">{title}</h3>
      </div>
      {children}
    </div>
  );

  const clearAllFilters = () => {
    setSelectedLanguage('');
    setSelectedGenre('');
    setSortOrder('newest');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-800">Filter Movies</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-lg transition-colors duration-200"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="space-y-4">
            {/* Language Filter */}
            <FilterSection title="Language" icon={Globe}>
              <CustomSelect 
                value={selectedLanguage}
                onChange={setSelectedLanguage}
                options={uniqueLanguages}
                placeholder="All Languages"
                label=""
              />
            </FilterSection>

            {/* Genre Filter */}
            <FilterSection title="Genre" icon={BookOpen}>
              <CustomSelect 
                value={selectedGenre}
                onChange={setSelectedGenre}
                options={uniqueGenres}
                placeholder="All Genres"
                label=""
              />
            </FilterSection>

            {/* Sort Options */}
            <FilterSection title="Sort by Release Date" icon={Calendar}>
              <CustomSelect 
                value={sortOrder}
                onChange={setSortOrder}
                options={[
                  { value: 'newest', label: 'Newest First' },
                  { value: 'oldest', label: 'Oldest First' }
                ]}
                placeholder="Sort Order"
                label=""
              />
            </FilterSection>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-2 p-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={clearAllFilters}
            className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-all duration-200"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm bg-slate-600 hover:bg-slate-700 text-white rounded-md transition-all duration-200"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

const MovieGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  const movies = useSelector((state) => state.movie.movies )
  
  const selectedCity = "New York"; // Replace with your actual Redux state

  // Filter movies
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = selectedLanguage === '' || movie.language.toLowerCase().includes(selectedLanguage.toLowerCase());
    const matchesGenres = selectedGenre === '' || movie.genre.toLowerCase().includes(selectedGenre.toLowerCase());
    return matchesSearch && matchesLanguage && matchesGenres;
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    const dateA = new Date(a.release_date);
    const dateB = new Date(b.release_date);
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const SearchBar = ({ value, onChange }) => (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Search movies..."
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 pl-10 pr-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );

  const MovieCard = ({ movie }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img 
        src={movie.poster} 
        alt={movie.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-slate-800 mb-2">{movie.title}</h3>
        <p className="text-slate-600 text-sm mb-2">{movie.description}</p>
        <div className="flex justify-between items-center text-sm text-slate-500">
          <span>{movie.language}</span>
          <span>{movie.duration} min</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search Bar and Filter Button */}
      <div className="mb-6 flex items-center justify-center space-x-4">
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Movies Grid */}
      <div className="bg-slate-100/50 backdrop-blur-sm rounded-3xl p-6 border shadow-md">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-800">Movies in {selectedCity}</h1>
          <p className="text-sm text-slate-600 mt-1">
            {sortedMovies.length} movie{sortedMovies.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        {sortedMovies.length === 0 ? (
        <div className="bg-slate-100/50 backdrop-blur-sm rounded-3xl p-8 border shadow-md">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-500 mb-2">No Movies Available</h3>
            <p className="text-sm text-slate-400">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {sortedMovies.map((movie) => (
              <MovieList key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
      <Upcomingmovies/>


      <MovieFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        movies={movies}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
    </div>
  );
};

export default MovieGrid;