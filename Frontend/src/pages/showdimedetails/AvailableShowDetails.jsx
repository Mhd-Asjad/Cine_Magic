import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Info, Sliders, ChevronLeft, ChevronRight, X, Navigation, Map, ExternalLink } from 'lucide-react';
import Nav from '@/components/navbar/Nav';
import Footer from '@/components/footer/Footer';
import { useSelector } from 'react-redux';
import { selectCityId } from '@/redux/features/Location.slice';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import not_found from '../../assets/not-found.png'
import apiMovies from '@/axios/Moviesapi';
import qs from 'qs';
import TheatreApi from '@/axios/theatreapi';

const AvailableShowDetails = () => {
  const [dateButtons, setDateButtons] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [movie, setMovie] = useState(null);
  const [showDetails, setShowDetails] = useState([]); 
  const [newMovies, setNewMovies] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  
  const { id } = useParams();
  const city_name = useSelector((state) => state.location.selectedCity);
  const cityid = useSelector(selectCityId);
  const navigate = useNavigate();

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error getting location:', error);
        }
      );
    }
  }, []);

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
    const timeSet = new Set();
    theatres.forEach(theatre => {
      theatre.shows.forEach(show => {
        show.slots.forEach(slot => {
          const slotLabel = slot.lablel || slot.label;
          if (slotLabel) {
            timeSet.add(slotLabel);
          }
        });
      });
    });
    return Array.from(timeSet).sort();
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
        const matchesLanguage = !selectedLanguage || 
          capitalizeString(show.movies_data.language.trim()) === selectedLanguage;
        
        return matchesDate && matchesLanguage;
      }).map(show => {
        const filteredSlots = show.slots.filter(slot => {
          if (!selectedTime) return true;
          const slotLabel = slot.lablel || slot.label;
          return slotLabel === selectedTime;
        });

        return {
          ...show,
          slots: filteredSlots.sort((a, b) => {
            const aTime = a.start_time || '00:00';
            const bTime = b.start_time || '00:00';
            return aTime.localeCompare(bTime);
          })
        };
      }).filter(show => show.slots.length > 0);

      return {
        ...theatre,
        shows: filteredShows
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

  // Date navigation functions
  const canNavigateLeft = currentDateIndex > 0;
  const canNavigateRight = currentDateIndex < Math.max(0, dateButtons.length - 6);

  const navigateDates = (direction) => {
    if (direction === 'left' && canNavigateLeft) {
      setCurrentDateIndex(currentDateIndex - 1);
    } else if (direction === 'right' && canNavigateRight) {
      setCurrentDateIndex(currentDateIndex + 1);
    }
  };

  const visibleDates = useMemo(() => {
    if (dateButtons.length <= 6) return dateButtons;
    return dateButtons.slice(currentDateIndex, currentDateIndex + 6);
  }, [dateButtons, currentDateIndex]);

  const fetchShowDetails = async () => {
    try {
      setLoading(true);
      const response = await apiMovies.get(`/showtimes/${id}/`, {
        params: { 'city_id': cityid },
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
      });
      console.log('Show details response:', response.data);
      const theatres = response.data.theatres;
      setNewMovies(response.data.movies || []);
      setShowDetails(theatres || []);

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

  const fetchTheatreLocation = async (theatreId) => {
    try {
      console.log('Fetching theatre location for ID:', theatreId);
      const response = await TheatreApi.get(`/theatre-location/${theatreId}/`);
      console.log('response', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching theatre location:', error);
      return null;
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

  const handleGetDirections = async (theatre) => {
    const locationData = await fetchTheatreLocation(theatre.id);
    if (locationData) {
      setSelectedTheatre({
        ...theatre,
        latitude: locationData.latitude,
        longitude: locationData.longitude
      });
    } else {
      setSelectedTheatre(theatre);
    }
    setShowDirectionsModal(true);
  };

  const openInGoogleMaps = (lat, lng, name) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
  };

  const openInAppleMaps = (lat, lng, name) => {
    const url = `https://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
  };

  const getDistanceFromUser = (theatreLat, theatreLng) => {
    if (!userLocation) return null;
    
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (theatreLat - userLocation.lat) * Math.PI / 180;
    const dLon = (theatreLng - userLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(theatreLat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance.toFixed(1);
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
        {movie && (
          <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">{movie.title}</h1>
            <p className="text-gray-600 leading-relaxed">{movie.description}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-gray-200">
            {dateButtons.length > 6 && (
              <button
                onClick={() => navigateDates('left')}
                disabled={!canNavigateLeft}
                className={`p-2 rounded-full transition-colors ${
                  canNavigateLeft 
                    ? 'text-gray-600 hover:bg-gray-100' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronLeft size={20} />
              </button>
            )}

            <div className="overflow-x-auto flex">

             <div className="flex space-x-2 min-w-max px-2 pb-2 scroll-smooth">
              {visibleDates.map((date, index) => (
                <button
                  key={date.toISOString()}
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
            {dateButtons.length > 6 && (
              <button
                onClick={() => navigateDates('right')}
                disabled={!canNavigateRight}
                className={`p-2 rounded-full transition-colors ${
                  canNavigateRight 
                    ? 'text-gray-600 hover:bg-gray-100' 
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronRight size={20} />
              </button>
            )}
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

        {totalShowCount > 0 ? (
          <div className="space-y-4">
            {filteredTheatres.map((theatre) => (
              <div key={theatre.name} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{theatre.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{theatre.address}</p>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleGetDirections(theatre)}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <MapPin size={16} className="mr-1" />
                        <span>Get Directions</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {theatre.shows.map((show) => (
                    <div key={show.show_id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-gray-600">
                          {capitalizeString(show.movies_data.language)} • {show.label}
                        </span>

                        {show.price.map((p, index) => (
                          <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            ₹{p}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex gap-3 flex-wrap">
                        {show.slots.map((slot) => (
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
                            <div className="text-xs text-gray-400 mt-1">
                              {slot.lablel || slot.label}
                            </div>
                          </button>
                        ))}
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
                <img src={not_found} alt="No shows found" className="w-full max-h-72 opacity-70" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Shows Found</h3>
              <p className="text-gray-600 mb-4">
                No shows available for the selected date and filters.
              </p>
              {(selectedLanguage || selectedTime) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-lg border border-gray-1 border-dashed  hover:bg-gray-100 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

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

      {showDirectionsModal && selectedTheatre && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Get Directions</h3>
                <button
                  onClick={() => setShowDirectionsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">{selectedTheatre.name}</h4>
                <p className="text-gray-600 text-sm mb-3">{selectedTheatre.address}</p>
                
                {selectedTheatre.latitude && selectedTheatre.longitude && userLocation && (
                  <p className="text-sm text-blue-600 mb-4">
                    <Navigation size={16} className="inline mr-1" />
                    Approximately {getDistanceFromUser(selectedTheatre.latitude, selectedTheatre.longitude)} km away
                  </p>
                )}
              </div>

              {selectedTheatre.latitude && selectedTheatre.longitude ? (
                <div className="space-y-3">
                  <button
                    onClick={() => openInGoogleMaps(selectedTheatre.latitude, selectedTheatre.longitude, selectedTheatre.name)}
                    className="w-full flex items-center justify-center gap-2 border-1 px-4 py-3 rounded-lg border transition-colors"
                  >
                    <Map size={20} />
                    <span>Open in Google Maps</span>
                    <ExternalLink size={16} />
                  </button>
                  
                  <button
                    onClick={() => openInAppleMaps(selectedTheatre.latitude, selectedTheatre.longitude, selectedTheatre.name)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    <MapPin size={20} />
                    <span>Open in Apple Maps</span>
                    <ExternalLink size={16} />
                  </button>

                </div>
              ) : (
                <div className="text-center py-6">
                  <MapPin size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600">Location coordinates not available for this theatre.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AvailableShowDetails;