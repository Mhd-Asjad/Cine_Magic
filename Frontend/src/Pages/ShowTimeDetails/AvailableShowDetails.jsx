import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Info, Sliders } from 'lucide-react';
import Nav from '@/components/Navbar/Nav';
import Footer from '@/components/Footer/Footer';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectCityId } from '@/Redux/Features/Location.slice';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import not_found from '../../assets/not-found.png'
import apiMovies from '@/Axios/Moviesapi';
import qs from 'qs';

const AvailableShowDetails = () => {

  const [dateButtons, setDateButtons] = useState([]);
  const [ selectedDate, setSelectedDate ] = useState(new Date());
  const [movie, setMovie] = useState(null);
  const [showDetails, setShowDetails] = useState([]);
  const [newMovies, setNewMovies] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  // const [prices , setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { id } = useParams();
  const city_name = useSelector((state) => state.location.selectedCity);
  const cityid = useSelector(selectCityId);
  const navigate = useNavigate();

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const capitalizeString = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const formatDateForComparison = (date) => {
    return date.toISOString().split('T')[0];
  };

  const processAvailableDates = (theatres) => {
    const dateSet = new Set();
    theatres.forEach(theatre => {
      theatre.shows.forEach(show => {
        dateSet.add(show.show_date);
      });
    });

    const uniqueDates = Array.from(dateSet).map(dateStr => new Date(dateStr));
    const today = new Date();
    const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    return uniqueDates
      .filter(date => date >= currentDate)
      .sort((a, b) => a - b);
  };

  const extractUniqueLanguages = (theatres) => {
    return [...new Set(theatres.flatMap(theatre => 
      theatre.shows.map(show => 
        capitalizeString(show.movies_data.language.trim())
      )
    ))].sort();
  };

  const extractUniqueShowTimes = (theatres) => {
    return [...new Set(theatres.flatMap(theatre =>
      theatre.shows.map(show => show.label)
    ))].sort();
  };

  const availableLanguages = useMemo(() => 
    extractUniqueLanguages(showDetails), [showDetails]
  );

  const availableShowTimes = useMemo(() => 
    extractUniqueShowTimes(showDetails), [showDetails]
  );

  const formattedSelectedDate = useMemo(() => 
    formatDateForComparison(selectedDate), [selectedDate]
  );

  const filteredTheatres = useMemo(() => {
    if (!showDetails.length) return [];

    return showDetails.map(theatre => {
      const filteredShows = theatre.shows.filter(show => {
        const matchesDate = show.show_date === formattedSelectedDate;

        // setting time and language
        
        const matchesLanguage = !selectedLanguage || 
          capitalizeString(show.movies_data.language.trim()) === selectedLanguage;
        
        const matchesTime = !selectedTime || show.label === selectedTime;

        return matchesDate && matchesLanguage && matchesTime;
      });

      return {
        ...theatre,
        shows: filteredShows.sort((a, b) => {
          const aFirstSlot = a.slots[0]?.start_time || '00:00';
          const bFirstSlot = b.slots[0]?.start_time || '00:00';
          return aFirstSlot.localeCompare(bFirstSlot);
        })
      };
    }).filter(theatre => theatre.shows.length > 0);
  }, [showDetails, formattedSelectedDate, selectedLanguage, selectedTime]);

  const totalShowCount = useMemo(() => {
    return filteredTheatres.reduce((count, theatre) => 
      count + theatre.shows.reduce((showCount, show) => 
        showCount + show.slots.length, 0
      ), 0
    );
  }, [filteredTheatres]);

  const fetchShowDetails = async () => {
    try {
      setLoading(true);
      const response = await apiMovies.get(`/showtimes/${id}/`, {
        params: { 'city_id': cityid },
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
      });

      const theatres = response.data.theatres;
      setNewMovies(response.data.movies || []);
      setShowDetails(theatres || []);

      console.log(response.data.theatres)
      const availableDates = processAvailableDates(response.data.theatres || []);
      setDateButtons(availableDates);

      if (availableDates.length > 0) {
        setSelectedDate(availableDates[0]);
      }
    } catch (error) {
      console.error('Error fetching show details:', error);
      setShowDetails([]);
      setNewMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovie = async () => {
    try {
      const res = await apiMovies.get(`/movie_details/${id}/`);
      setMovie(res.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    if (name === 'language') {
      setSelectedLanguage(value);
    } else if (name === 'time') {
      setSelectedTime(value);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedLanguage('');
    setSelectedTime('');
  };

  const handleShowClick = (screen_id, show_id, slot_id) => {
    navigate(`/available-show-details/${screen_id}/${show_id}/seats?slot_id=${slot_id}`);
  };

  const clearFilters = () => {
    setSelectedLanguage('');
    setSelectedTime('');
  };

  useEffect(() => {
    if (id && cityid) {
      fetchShowDetails();
      fetchMovie();
    }
  }, [id, cityid]);


  console.log(filteredTheatres)

  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Nav />
        <div className="container mx-auto px-4 py-6 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading show details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Nav />
      <div className="container mx-auto px-4 py-6 flex-grow">
        {/* Movie Header */}
        {movie && (
          <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">{movie.title}</h1>
            <p className="text-gray-600 leading-relaxed">{movie.description}</p>
          </div>
        )}

        {/* Date Selection and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          {/* Date Selection */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-4 border-b border-gray-200">
            <div className="flex space-x-2 min-w-max">
              {dateButtons.map((date, index) => (
                <button
                  key={index}
                  className={`flex flex-col items-center justify-center px-4 py-3 rounded-lg transition-all duration-200 min-w-[70px] ${
                    selectedDate.toDateString() === date.toDateString()
                      ? 'bg-blue-500 text-white shadow-md transform scale-105'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => handleDateSelect(date)}
                >
                  <span className="text-xs font-medium">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-lg font-bold">{date.getDate()}</span>
                  <span className="text-xs">
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Sliders size={18} className="text-gray-600" />
              <span className="font-semibold text-gray-700">Filter by:</span>
            </div>
            
            <FormControl size="small" sx={{ minWidth: 120, backgroundColor: 'white' }}>
              <InputLabel>Language</InputLabel>
              <Select
                name="language"
                value={selectedLanguage}
                onChange={handleFilterChange}
                label="Language"
              >
                <MenuItem value="">
                  <em>All Languages</em>
                </MenuItem>
                {availableLanguages.map((lang, index) => (
                  <MenuItem key={index} value={lang}>{lang}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120, backgroundColor: 'white' }}>
              <InputLabel>Show Time</InputLabel>
              <Select
                name="time"
                value={selectedTime}
                onChange={handleFilterChange}
                label="Show Time"
              >
                <MenuItem value="">
                  <em>All Times</em>
                </MenuItem>
                {availableShowTimes.map((time, index) => (
                  <MenuItem key={index} value={time}>{time}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {(selectedLanguage || selectedTime) && (
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Clear Filters
              </button>
            )}

            <div className="ml-auto text-sm text-gray-600">
              {totalShowCount} shows available
            </div>
          </div>
        </div>

        {/* Show Results */}
        {totalShowCount > 0 ? (
          <div className="space-y-4">
            {filteredTheatres.map((theatre) => (
              <div key={theatre.name} className="bg-white rounded-lg shadow-sm p-6">
                {/* Theatre Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{theatre.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{theatre.address}</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
                        <MapPin size={16} className="mr-1" />
                        <span>Get Directions</span>
                      </button>
                      <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
                        <Info size={16} className="mr-1" />
                        <span>More Info</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Show Times */}
                <div className="space-y-4">
                  {theatre.shows.map((show) => (
                    <div key={show.show_id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-gray-600">
                          {capitalizeString(show.movies_data.language)} • {show.label}
                        </span>

                        {show.price.map(p => (

                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            ₹{p}
                          </span>

                        ))}
                      </div>
                      
                      <div className="flex gap-3 flex-wrap">
                        {show.slots
                          .sort((a, b) => a.start_time.localeCompare(b.start_time))
                          .map((slot) => (
                            <button
                            key={slot.slot_id}
                            className="border-2 border-green-500 rounded-lg px-4 py-3 text-green-600 hover:bg-green-50 hover:border-green-600 transition-all duration-200 flex flex-col items-center min-w-[100px] group"
                            onClick={() => handleShowClick(show.screen.screen_id, show.show_id, slot.slot_id)}
                            >
                              <div className="text-lg font-bold group-hover:text-green-700">
                                {formatTime(slot.start_time)}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {show.screen.screen_type}
                              </div>
                            </button>
                          ))
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-gray-50 mb-4">
                <img src={not_found} alt="No shows found" className="w-16 h-16 opacity-70" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Shows Found</h3>
              <p className="text-gray-600 mb-4">
                No shows available for the selected date and filters.
              </p>
              {(selectedLanguage || selectedTime) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Latest Movies Section */}
        {newMovies.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Latest Movies to Book in {city_name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {newMovies.map((movie, index) => (
                <span key={movie.id} className="text-gray-600 text-sm">
                  {movie.movie_name}
                  {index < newMovies.length - 1 && ' • '}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AvailableShowDetails;