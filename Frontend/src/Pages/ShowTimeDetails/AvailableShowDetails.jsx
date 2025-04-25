import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Info } from 'lucide-react';
import Nav from '@/Components/Navbar/Nav';
import Footer from '@/Components/Footer/Footer';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectCityId } from '@/Redux/Features/Location.slice';
const AvailableShowDetails = () => {
  const [dateButtons, setDateButtons] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [movie, setMovie] = useState(null);
  const [showDetails, setShowDetails] = useState([]);
  const [newMovies , setNewMovies] = useState([]);
  const { id } = useParams();
  const city_name = useSelector((state)=> state.location.selectedCity)
  const cityid = useSelector(selectCityId);
  console.log(cityid , 'city')
  const navigate = useNavigate();

  useEffect(() => {
    fetchShowDetails();
    fetchMovie();
  }, []);
  
  const fetchShowDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/movies/showtimes/${id}/`, {
        params : {
          'city_id' : cityid
        }
      });
      console.log(response.data);
      setNewMovies(response.data.movies)

      const theatres = response.data.theatres;
      setShowDetails(theatres);

      const dateSet = new Set();
      theatres.forEach(theatre => {
        theatre.shows.forEach(show => {
          dateSet.add(show.show_date);
        });
      });

      const uniqueDates = Array.from(dateSet).map(dateStr => new Date(dateStr));
      const today = new Date();
      const currentDate = new Date(today.getFullYear(), today.getMonth() , today.getDate());

      const filteredDate = uniqueDates
      .filter(date => date >= currentDate)
      .sort((a , b ) => a - b);
      setDateButtons(filteredDate);

      console.log(filteredDate.length)
      if (filteredDate.length > 0) {
        setSelectedDate(filteredDate[0]);
      }

    } catch (error) {
      console.log(error.response || error);
    }
  };

  const fetchMovie = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/movies/movie_details/${id}/`);
      setMovie(res.data);
    } catch (error) {
      console.log(error.response || error);
    }
  };
  const formatTime = (timeString) => {
    const [hours , minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours , minutes)
    return date.toLocaleTimeString([] , {hour : '2-digit' , minute : '2-digit' , hour12:true});
  }
  const formattedSelectedDate = selectedDate.toISOString().split('T')[0];
  const handleClick = (screen_id , show_id) => {
    navigate(`/available-show-details/${screen_id}/${show_id}/seats`)
  }

  console.log(showDetails)
  const sortedShowTime = showDetails.sort((a , b) => {
    return a.show?.start_time.localeCompare(b.show?.start_time)

  })
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Nav />
      <div className="container mx-auto px-4 py-6 flex-grow">
        {movie && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            <p className="text-gray-600">{movie.description}</p>
          </div>
        )}

        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          {dateButtons.map((date, index) => (
            <button
              key={index}
              className={`flex flex-col items-center justify-center px-4 py-2 rounded-md ${
                selectedDate.toDateString() === date.toDateString()
                  ? 'bg-blue-500 text-white'
                  : 'bg-white'
              }`}
              onClick={() => setSelectedDate(date)}
            >
              <span className="text-xs">

                {date.toLocaleDateString('en-US', { weekday: 'short' })}

              </span>
              <span className="text-lg font-semibold">{date.getDate()}</span>
            </button>
            
          ))}
        </div>

        {sortedShowTime
        .filter(theatre => theatre.shows.some(show => show.show_date === formattedSelectedDate))
        .map((theatre, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm p-4 mt-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">{theatre.name}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <button className="flex items-center mr-4">
                    <MapPin size={16} className="mr-1" />
                    <span>Get Directions</span>
                  </button>
                  <button className="flex items-center">
                    <Info size={16} className="mr-1" />
                    <span>More Info</span>
                  </button>
                </div>
              </div>
            </div>

            <div className='flex gap-3'>
              {theatre.shows
                .filter(show => show.show_date === formattedSelectedDate)
                .map((show, idx) => (
                  <button 
                    key={idx} 
                    className="border border-gray-200 rounded px-4 py-2 text-green-600 hover:bg-gray-50"
                    onClick={() => handleClick(show.screen.screen_id, show.show_id)}
                    >
                    <div className="text-center font-semibold">{formatTime(show.start_time)}</div>
                    <div className="text-xs text-gray-500">{show.screen.screen_type}</div>
                  </button>
                ))}
            </div>
          </div>
      ))}


          <div className="mb-6 ">
            <h3 className="text-lg font-semibold mb-2">Latest Movies to Book in {city_name}</h3>

            <div className="text-sm text-blue-600 mb-2">
              {
                newMovies.map((movie) => (
              <span key={movie.id} >{`${movie.movie_name} |`}  </span>

                ))
              }
            </div>
          </div>	
        </div>
      <Footer/>
    </div>
  );
};

export default AvailableShowDetails;