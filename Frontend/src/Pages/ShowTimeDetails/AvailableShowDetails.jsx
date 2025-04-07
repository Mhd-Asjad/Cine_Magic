import React, { useState ,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Info } from 'lucide-react';
import Nav from '@/Components/Navbar/Nav';
import Footer from '@/Components/Footer/Footer';

const AvailableShowDetails = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  // const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [movie , setMovies] = useState();
  const [showDetails , setShowDetails ] = useState([]);
  const { id } = useParams();
    useEffect(() => {

        fetchShowDet()

    },[])
    const fetchShowDet = async()=> {
      console.log('hello')
      try{
        const response = await axios.get(`http://localhost:8000/movies/showtimes/${id}/`);
        setShowDetails(res.data.show_times);  
      }catch(e) {
        console.log(e.response)
      }
    }

    // const fetchMovie = async () => {
    //     try {
    //       const res = await axios.get(`http://localhost:8000/movies/movie_details/${id}/`)
    //       setMovies(res.data)
    //     }catch(e){
    //       console.log(e.response)
    //     }
    // }
    

    console.log(showDetails)

  const castMembers = [
    { name: "Mohanlal", image: "https://via.placeholder.com/80" },
    { name: "Prithviraj Sukumaran", image: "https://via.placeholder.com/80" },
    { name: "Siddique", image: "https://via.placeholder.com/80" },
    { name: "Tovino Thomas", image: "https://via.placeholder.com/80" },
    { name: "Indrajith Sukumaran", image: "https://via.placeholder.com/80" },
    { name: "Manju Warrier", image: "https://via.placeholder.com/80" },
    { name: "Samyuktha Menon", image: "https://via.placeholder.com/80" },
    { name: "Baiju Santhosh", image: "https://via.placeholder.com/80" }
  ];
  const dateButtons = [];
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dateButtons.push(date);
  }
  
  return (
    <div className="bg-gray-100 min-h-screen">
      <Nav />
      
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          
          {dateButtons.map((date, index) => (
            <button
            key={index}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-md ${
              selectedDate.toDateString() === date.toDateString() ? 'bg-red-500 text-white' : 'bg-white'
            }`}
            onClick={() => setSelectedDate(date)}
            >
              <span className="text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <span className="text-lg font-semibold">{date.getDate()}</span>
            </button>
          ))}
         <Calendar size={18} className="mr-2" />
          <span>Filter By</span>
        
        </div>
        
        {/* Format and Price Filters */}
        <div className="flex gap-2 my-4 overflow-x-auto">
          <div className="dropdown inline-block">
            <button className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm">
              Format <span className="ml-2">▼</span>
            </button>
          </div>
          
          <div className="dropdown inline-block">
            <button className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm">
              Price <span className="ml-2">▼</span>
            </button>
          </div>
          
          <div className="dropdown inline-block">
            <button className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm">
              ShowTime <span className="ml-2">▼</span>
            </button>
          </div>
          
          <div className="ml-auto flex items-center">
            <input type="checkbox" id="premium" className="mr-2" />
            <label htmlFor="premium" className="text-sm">Premium Seats</label>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative my-4">
          <input 
            type="text" 
            placeholder="Search Theatres" 
            className="w-full p-2 pl-10 border border-gray-300 rounded-md"
          />
          <span className="absolute left-3 top-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
        
        {/* Theatre and Show Times */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Pee Cee Talkies 4K Atmos, Mukkam</h3>
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
          
            {/* <div className="flex flex-wrap gap-4">
              {showDetails.map((show, idx) => (
                <button 
                  key={idx} 
                  className="border border-gray-200 rounded px-4 py-2 text-green-600 hover:bg-gray-50"
                >
                  <div className="text-center font-semibold">{show.start_time} PM</div>
                  <div className="text-xs text-gray-500">{show.screen.screen_type} {show.screen.screen_number}</div>
                </button>
              ))}
            </div> */}
        </div>
        
        {/* Movie Cast */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">L2: Empuraan Movie Cast</h3>
          <div className="flex overflow-x-auto space-x-4 pb-2">
            {castMembers.map((actor, index) => (
              <div key={index} className="flex flex-col items-center min-w-max">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
                  <img src={actor.image} alt={actor.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs text-center max-w-16 truncate">{actor.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Latest Movies to Book */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Latest Movies to Book in Mukkam</h3>
          <div className="text-sm text-blue-600 mb-2">
            <span>Veera Dheera Sooran: Part 2</span> | <span>Kalki</span> | <span>Arya 2 (2009)</span>
          </div>
        </div>
        

      </div>

      <Footer/>
    </div>
  );
};

export default AvailableShowDetails;