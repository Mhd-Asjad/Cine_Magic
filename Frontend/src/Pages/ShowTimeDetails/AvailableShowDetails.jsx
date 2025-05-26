import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Info } from 'lucide-react';
import Nav from '@/Components/Navbar/Nav';
import Footer from '@/Components/Footer/Footer';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectCityId } from '@/Redux/Features/Location.slice';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import not_found from '../../assets/not-found.png'
import { Sliders } from 'lucide-react';
import apiMovies from '@/Axios/Moviesapi';
import qs from 'qs';


const AvailableShowDetails = () => {
  const [dateButtons, setDateButtons] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [movie, setMovie] = useState(null);
  const [showDetails, setShowDetails] = useState([]);
  const [newMovies , setNewMovies] = useState([]);
  const [ selectedLanguage , setSelectedLanguage] = useState('');
  const [selectedTime , setSelectedTime] = useState('');
  const { id } = useParams();
  const city_name = useSelector((state)=> state.location.selectedCity)
  let cityid = useSelector(selectCityId);
  console.log(cityid , 'city' , 'movie_id : ' , id)
  const navigate = useNavigate();

  useEffect(() => {
    fetchShowDetails();
    fetchMovie();
  }, []);
  
  const fetchShowDetails = async () => {
    try {
      const response = await apiMovies.get(`/showtimes/${id}/`, {
        params : {
          'city_id' : cityid
        },
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })

      });
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

  console.log(movie)
  const fetchMovie = async () => {
    try {
      const res = await apiMovies.get(`/movie_details/${id}/`);
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
  const handleClick = (screen_id , show_id ,slot_id) => {
    navigate(`/available-show-details/${screen_id}/${show_id}/seats?slot_id=${slot_id}`)
  }

  
  const languages = [...new Set(showDetails.flatMap(cinema => 
    cinema.shows.map(show => 
      show.movies_data.language.trim().toLowerCase()
    )))].map(lang => lang.charAt(0).toUpperCase() + lang.slice(1)); 
  console.log(languages)
 
  const showTime = [...new Set(showDetails.flatMap(cinema =>
    cinema.shows.map(show=>
      show.label
    )
  ))]
  
  
  console.log(showDetails , 'show details')

  const sortedShowTime = showDetails.map(theatre => {
    const filteredShow = theatre.shows.filter(show =>  
    (!selectedLanguage || show.movies_data.language.charAt(0).toUpperCase() + show.movies_data.language.slice(1).toLowerCase() === selectedLanguage) && 
    (!selectedTime || show.label === selectedTime )
    )
    console.log(selectedLanguage)
  
    return{
    // need to fix sort data here
      ...theatre,
      shows : filteredShow
    
    }
  })


  const handleChange = (event) => {
    const {name , value} = event.target;
    if (name === 'language'){
      setSelectedLanguage(value)
    }else if(name === 'time') {
      
      setSelectedTime(value)
    }
  }
  
  let showCount = 0;
  const formatted_time = selectedDate.toISOString().split('T')[0];
  const filterShowDate = sortedShowTime.map((theatre) => {
    theatre.shows.filter(show => {
      if (show?.show_date == formatted_time){
        showCount++;
      }
    }
    )
  })

  console.log(showCount , 'sorted one  ')
  console.log(sortedShowTime)
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

        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide relative ">
          <div className='flex space-x-2' >

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

          <div className='flex items-center shrink-0 gap-6' >
            <p className='font-semibold ml-2 pl-3' ><Sliders className='inline ml-2 gap-1' />filter By </p>
            <div>
              <FormControl sx={{ m: 1, minWidth: '100px' , backgroundColor : 'white' }}>
                  <InputLabel id="demo-simple-select-autowidth-label">lang</InputLabel>
                  <Select
                    labelId="language-select-label"
                    name='language'
                    value={selectedLanguage}
                    onChange={handleChange}
                    autoWidth

                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>

                      {languages.map((lang,index) => (

                        <MenuItem key={index} value={lang}>{lang}</MenuItem>
                        // <MenuItem value={23} key={index} >English</MenuItem>

                      ))}
                  </Select> 
              </FormControl>
            </div>
              <FormControl sx={{ m: 1, minWidth: '100px' , backgroundColor : 'white'}}>
                <InputLabel id="demo-simple-select-label">Time</InputLabel>
                <Select
                  name='time'
                  value={selectedTime}
                  onChange={handleChange}
                  autoWidth
                >
                  <MenuItem value="">
                  <em>None</em>
                  </MenuItem>
                    {showTime.map((show , index ) => (
                      <MenuItem key={index} value={show}>{show}</MenuItem>
                    ))}
                </Select> 
              </FormControl>
            <div>
            </div>
          </div>
        </div>
                    
        <div>
          <span className='px-1 ' ></span>
        </div>
        {showCount > 0 ? (
          sortedShowTime
          .filter(theatre => theatre.shows.some(show => show.show_date === formattedSelectedDate))
          .map((theatre) => (
            <div key={theatre.name} className="bg-white rounded-lg shadow-sm p-4 mt-4 mb-6">
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

              <div className='flex gap-3 flex-wrap'>
                {theatre.shows
                  .filter(show => show.show_date === formattedSelectedDate)
                  .map((show) =>
                    show.slots.map((slot) => (
                      <button
                        key={slot.slot_id || `${show.show_id}-${slot.start_time}`}
                        className="border border-gray-200 rounded px-4 py-2 text-green-600 hover:bg-gray-50 flex flex-col items-center"
                        onClick={() => handleClick(show.screen.screen_id, show.show_id , slot.slot_id)}
                      >
                        <div className="text-center font-semibold">
                          {formatTime(slot.start_time)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {show.screen.screen_type}
                        </div>
                      </button>
                    ))
                  )
                }
              </div>
            </div>
          ))
          ):(
            <div className='bg-white rounded-lg shadow-sm p-4 mt-4 mb-6' >
              <div className="text-center py-2">
                  <div className="inline-block p-3 rounded-ful">
                      <img src={not_found} alt="notfound" />
                  </div>
                  <p className="mt-2 text-2xl font-bold text-gray-800">No Show found</p>
              </div>
            </div>
          )}
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