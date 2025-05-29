import React, { useEffect, useState } from 'react';
import { 
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { 
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle, 

} from '@/components/ui/dialog';
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TheatreApi from '@/Axios/theatreapi';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import { Eye , X } from 'lucide-react';
import { TbClockPlus } from "react-icons/tb";
import Swal from 'sweetalert2';
import apiAdmin from '@/Axios/api';
import { Terminal } from 'lucide-react';
import seatsApi from '@/Axios/seatsaApi';
import screenimg from '../../../assets/screen.png'

function ShowScreen() {
    const { id } = useParams();
    const [screens, setScreens] = useState([]);
    const [ movies , setMovies ] = useState([]);
    const [ isDialogOpen , setDialogOpen] = useState(false)
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedScreen, setSelectedScreen] = useState(null);
    const [ showDate, setShowDate] = useState("");
    const [ endDate , setEndDate ] = useState("")
    const [ showTimes , setShowTime] = useState([])
    const [selectedShowTime , setSelectedShowTime] = useState([]);
    const [ showDetails , setShowDetails ] = useState([]);
    const [ isShowDialogOpen , setIsDialogOpen] = useState(false)
    const [ message , setMessage ] = useState('')
    const [ seats , setSeats ] = useState({})
    const {toast} = useToast();
    const navigate = useNavigate();
    useEffect(() => {
        fetchData();
        fetchShowtime()
    }, [id]);
    
    const fetchData = async () => {
        try {
            const res = await TheatreApi.get(`/show-screens/?theatre_id=${id}`);
            setScreens(res.data.data);


            const movieRes = await TheatreApi.get('fetchmovies/')
            setMovies(movieRes.data)
        } catch (e) {
            console.log(e.response);
        }
    };
    
    const fetchSeatLayout = async(screen_id) => {
        try {
            const res = await seatsApi.get(`screens/${screen_id}/seats/`)
            const organizeData = organizeByRow(res.data)
            setSeats(organizeData)
        }catch(e){
            console.log(e.response)
        }
    }
    const organizeByRow = (seats) => {
        const rowMap = {}
        seats.forEach((seat) => {
          if (!rowMap[seat.row]) {
            rowMap[seat.row] = []
          }
          rowMap[seat.row].push(seat)
        })
        Object.values(rowMap).forEach((rowSeats) => {
          rowSeats.sort((a, b) => a.number - b.number)
        })
        return rowMap
      }

      console.log(seats)
    const getSeatClass = () => {
    return 'bg-white text-blue cursor-not-allowed outline outline-1 outline-blue-600'
    }

    useEffect(() => {
        const fetchTimeSlot = async() => {
            try{

                const res = await TheatreApi.get(`/get_time-slots/?screen_id=${selectedScreen.id}`);

                console.log(res.data.data , 'time slot')
                const sortedShowtimes = [...res.data.data].sort((a,b) => {
                    const timeA = a.start_time ?? '';
                    const timeB = b.start_time ?? '';
                    return timeA.localeCompare(timeB);
                  });

                  console.log(sortedShowtimes , 'values')
                  
                  
                setShowTime(sortedShowtimes);
                    
            }catch(e) {
                console.log(e , 'error while fetching show time')
            }

        }
        fetchTimeSlot()
    },[selectedScreen])
    console.log(showTimes,'rajabma')



    const formatTime = (timeString) => {
        const [hours , minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(hours , minutes)
        return date.toLocaleTimeString([] , {hour : '2-digit' , minute : '2-digit' , hour12:true});
    }
    
    const handleAddShowTime = async() => {
        if (!selectedMovie || !selectedScreen || !showDate || !selectedShowTime ) {
            toast({
                title : 'please fill up all fields',
                variant:"destructive"
            })
            return;
        }
        try{
            const res = await TheatreApi.post('/add-showtime/', {
                "screen_number" : selectedScreen.screen_number,
                "movie" : selectedMovie.id,
                'screen' : selectedScreen.id,
                'slot' : selectedShowTime,
                'show_date' : showDate,
                'end_date' : endDate
                
            })
            console.log(res.data)
            toast({
                title: "Showtime added successfully!",
                description: `Movie: ${selectedMovie.title} - Screen: ${selectedScreen.screen_number}`,
                variant: "success",
            });
            setSelectedMovie(null)
            setSelectedScreen(null)
            setSelectedShowTime(null)
            setShowDate("")
            setDialogOpen(false);
        }catch(e){
            
            console.log(e.response.data.Error || 'something went wrong')
            console.log('went to the catch session')
            console.log(e)
            toast({title : e.response.data?.Error ,
                variant : "destructive",
                action: <ToastAction className='flex border border-light font-semibold rounded py-1 pl-1 pr-1' altText="Try again">Try again</ToastAction>,
            });

            }
    }

     console.log(selectedShowTime , 'new')

    const fetchShowtime = async() => {
        try{
            const res = await TheatreApi.get(`/showtime/${id}/`);
            setShowDetails(res.data)
        }catch(e){
            console.log(e.response)
        }
    }   
    console.log(showDetails)
    
    const handleAddScreen = () => {
        navigate(`/theatre-owner/${id}/add-screen`)
    }

    const today = new Date();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const upcomingShows = showDetails.filter((show) => {
        const showDate = new Date(show.show_date);
        return showDate > yesterday;
    });
    
    
    let sortedShowDetails = [...upcomingShows].sort((a , b)=>{
        a.movie_name.localeCompare(b.movie_name)
    });
    console.log(sortedShowDetails , 'sorted one')
    
    const handleCancel = async(show_id) => {

        try{
            const res = await apiAdmin.delete(`cancel-show/${show_id}/`)
            const res1 = await TheatreApi.get(`/showtime/${id}/`);
            setMessage(res.data.message)
            setShowDetails(res1.data)

        }catch(e) {
            console.log(e)
        }
        
    }

    // Allow selecting multiple showtimes, toggling them in the array
    const handleSelectedShowTime = (showtimeId) => {
        setSelectedShowTime((prev) => {
            if (Array.isArray(prev)) {
                if (prev.includes(showtimeId)) {
                    return prev.filter(id => id !== showtimeId);
                } else {
                    return [...prev, showtimeId];
                }
            } else if (prev) {
                return [prev, showtimeId];
            } else {
                return [showtimeId];
            }
        });
    }

    console.log(selectedShowTime , 'selected show time')

    return (
        <div className='p-10 m-10'>

            

            <Card className="w-full py-10 max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex justify-center text-xl font-semibold text-gray-700">
                        Screens Available
                    </CardTitle>
                    <div className='flex justify-end pr-4 '>

                    <Button className=' w-[20%] bg-blue-500 ' 
                        onClick={handleAddScreen}
                    >
                        add screen
                    </Button>
                    </div>
                    <div className='w-full overflow-x-auto'>
                        <table className='w-full border-collapse'>
                            <thead>
                                <tr>
                                    <th className='p-3 text-left'>Screen Number</th>
                                    <th className='p-3 text-left'>Capacity</th>
                                    <th className='p-3 text-left'>Screen Type</th>
                                    <th className='p-3 text-left' >Status</th>
                                

                                    <th className='p-3 text-end'>Action</th>
    
                                </tr>
                            </thead>
                            <tbody>
                                {screens.length > 0 ? (
                                    screens.map((screen, indx) => (
                                        screen.is_approved ? (

                                        
                                        <tr key={indx} className="border-b hover:bg-gray-50">
                                            <td className='pl-10'>
                                                <Badge className="py-3">
                                                    {screen.screen_number}
                                                </Badge>
                                            </td>
                                            <td className='p-4'>{screen.capacity}</td> 
                                            <td className='p-4'>{screen.screen_type}</td>
                                            <div className='flex justify-end' >
                                            <td className='p-3'> 
                                                <button className='border-green-400 border-2 py-2 px-1 cursor-not-allowed rounded-md' >
                                                    confirmed 
                                                </button>
                                            </td>

                                            </div>

                                            <td className='' >
                                            <Dialog>

                                                <DialogTrigger asChild >
                                                    <Button 
                                                        onClick={() => {

                                                         fetchSeatLayout(screen.id);
                                                        
                                                        }}
                                                    >
                                                    
                                                    Seat Layout

                                                    </Button>


                                                </DialogTrigger>

                                                <DialogContent>
 
                                                    <div className='p-4' >

                                                        <DialogTitle className="text-xl font-bold mb-10 text-center" >
                                                            seat Layout
                                                        </DialogTitle>

                                                        <div className='mt-5'>
                                                    <div className='flex flex-wrap gap-2'>
                                                    {Object.entries(seats).map(([row, rowSeats]) => {
                                

                                                        return (
                                                        <div
                                                            key={row}
                                                            className='flex justify-center w-full mb-4'
                                                        >
                                                            <button
                                                            className={`w-6 h-6 font-bold mr-2 rounded cursor-not-allowed`}
                                                            >
                                                            {row}
                                                            </button>

                                                            <div className='flex space-x-1'>
                                                            {rowSeats.map((seat) => (
                                                                seat?.label ? (


                                                                <button
                                                                    type='button'
                                                                    key={seat.id}
                                                                    disabled={true }
                                                                    title={`${seat.category_name || 'No Category'} - ₹${seat.price}`}
                                                           
                                                                
                                                                    className={`w-6 h-6 rounded-sm  flex items-center justify-center text-xs ${getSeatClass(
                                                                    seat
                                                                    )}`}
                                                                >
                                                                    {seat.number}
                                                                </button>

                                                                ):(

                                                                <div key={seat.id} className="w-6 h-6"/>
                                                                )
                                                            ))}
                                                            </div>
                                                        </div>
                                                        )
                                                    })}
                                                    <div className="relative mb-8 pb-28 z-0">
                                                    <div className="flex justify-center ">
                                                        <img src={screenimg} className='w-[80%] mt-3' alt="screen image" ></img>
                                                    </div>
                                                    </div>
                                                    </div>

                                                    
                                                </div>




                                                    </div>


                                                </DialogContent>
                                            </Dialog>

                                            </td>
 
                                            <div>

                                            </div>
                                        <td className='p-4'> 
                                            <div className='flex space-x-2'>

                                              

                                                {sortedShowDetails.length > 0 ? (
                                                    <Dialog>
                                                        <DialogTrigger>
                                                            <Button variant="outline" size="icon" 
                                                            
                                                            >
                                                                <Eye className='h-4 w-2' />
                                                            </Button>

                                                        </DialogTrigger>
                                                        
                                                            <DialogContent className="sm:max-w-xl max-h-screen overflow-y-auto mb-1 bg-white" >

                                                            {message &&(

                                                                <Alert className='cursor-pointer hover:bg-gray-100 hover:border-1 mt-3' onClick={() => setMessage('')} >
                                                                <Terminal className="h-4 w-4" />
                                                                <AlertTitle>alert</AlertTitle>
                                                                <AlertDescription>
                                                                    {message}
                                                                </AlertDescription>
                                                                </Alert>
                                                                )
                                                            }
                                                            <div className="p-4">
                                                                <DialogTitle className="text-xl font-bold mb-4 text-center">

                                                                showtime of Movie (Screen {screen.screen_number})
                                                                </DialogTitle>

                                                  
                                                                        
                                                                        <ul className="list-disc pl-5">
                                                                        {sortedShowDetails.map((show) => {
                                                        
                                                                            if (show.screen_number == screen.screen_number ) { 

                                                                                return (
                                                                                    <div key={show.id} className="grid grid-cols-3 items-center gap-4 p-4 border rounded my-2">
                                                                                    
                                                                                    <div className="flex">
                                                                                        <img className="w-44 h-32 object-cover" src={show.poster} alt="Poster" />
                                                                                    </div>

                                                                                    <div className="flex flex-col text-sm w-52">
                                                                                        <p><strong>Movie name:</strong> {show.movie_name}</p>
                                                                                        <p><strong>Show Date:</strong> {show.show_date}</p>
                                                                                        <p><strong>Start Time:</strong> {formatTime(show.start_time)}</p>
                                                                                    </div>
                                                                                    
                                                                                    <div className="flex justify-center ml-5 mt-[60%]">
                                                                                        <Button
                                                                                        onClick={() => handleCancel(show.id)}
                                                                                        className="border text-white px-2 py-2 rounded"
                                                                                        >
                                                                                        <X className='h-4 w-2' /> Cancel Show
                                                                                        </Button>
                                                                                    </div>

                                                                                    </div>

                                                                                );
                                                                            }
                                                                            return null  
                                                                            
                                                                        })}
                                                                        </ul>   
                                                            </div>
                                                        
                                                            </DialogContent>
                                                    </Dialog>
                                                    ) : null
                                                }   
                                                <Dialog
                                                    open={isDialogOpen}
                                                    onOpenChange={(open) => {
                                                        setDialogOpen(open);
                                                        if (!open) setSelectedMovie(null);
                                                    }}
                                                    >
                                                    <DialogTrigger asChild>
                                                        <Button 
                                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                                        onClick={() => {
                                                            setSelectedScreen(screen);
                                                            setIsDialogOpen(true)
                                                        }}
                                                        >
                                                        Add Show
                                                        </Button>
                                                    </DialogTrigger>
                                                
                                                    <DialogContent className="max-w-none max-h-screen w-fit bg-white">
                                                        <div className='flex justify-center' >
                                                        <DialogTitle className=" text-xl w-fit font-bold mb-4" >
                                                        Select a Movie

                                                        </DialogTitle>

                                                        </div>
                                                        <div className="p-4">
                                                        <Carousel className="w-full">
                                                            <CarouselContent>
                                                            {movies.length > 0 ? (
                                                                movies.map((movie) => (
                                                                <CarouselItem key={movie.id} className="md:basis-1/2 lg:basis-1/3 p-2">
                                                                    <div 
                                                                    className={`cursor-pointer rounded-lg transition-all duration-300 ${
                                                                        selectedMovie === movie ? "ring-2 ring-blue-500" : "hover:bg-gray-50"
                                                                    }`}
                                                                    onClick={() => setSelectedMovie(movie)}
                                                                    >
                                                                    <Card className="w-full bg-white">
                                                                        <CardContent className="p-0">
                                                                        <div className="flex flex-col items-center">
                                                                            <div className="w-full h-64 overflow-hidden">
                                                                            <img 
                                                                                src={movie.poster} 
                                                                                alt={movie.title} 
                                                                                className="w-full h-full object-cover rounded-t-lg"
                                                                            />
                                                                            </div>
                                                                            <div className="p-4 text-center w-full">
                                                                            <h3 className="text-lg font-medium">
                                                                                {movie.title}
                                                                            </h3>
                                                                            </div>
                                                                        </div>
                                                                        </CardContent>
                                                                    </Card>
                                                                    </div>
                                                                </CarouselItem>
                                                                ))
                                                            ) : (
                                                                <CarouselItem>
                                                                <div className="h-60 flex items-center justify-center">
                                                                    <p className="text-center text-gray-500">No movies available</p>
                                                                </div>
                                                                </CarouselItem>
                                                            )}
                                                            </CarouselContent>
                                                            <CarouselPrevious className="left-2" />
                                                            <CarouselNext className="right-2" />
                                                        </Carousel>
                                                        
                                                        {selectedMovie && (
                                                            <div className="mt-4 space-y-3">
                                                                <h2 className="text-lg flex justify-center font-semibold text-gray-700">
                                                                    Add Showtime for {selectedMovie.title}
                                                                </h2>
                                                                    <label className='font-bold pl-3 flex justify-center ' >show Date</label>
                                                                <div className='flex justify-center pl-4 gap-3' >

                                                                <Input
                                                                    type="date"
                                                                    value={showDate}
                                                                    onChange={(e) => setShowDate(e.target.value)}
                                                                    className="w-[23%] border-gray-300 rounded-lg px-4 py-2"
                                                                    placeholder="Start Time"
                                                                    />

    
                                                                    <div className='mt-1' >
                                                                        <p className='font-semibold' >to</p>
                                                                    </div>

                                                                    <Input
                                                                        type="date"
                                                                        value={endDate}
                                                                        onChange={(e) => setEndDate(e.target.value)}
                                                                        className="w-[23%] border-gray-300 rounded-lg px-4 py-2"
                                                                        placeholder="End Date"
                                                                    />
                                                              
                                                                </div>
                                                                <div className='pl-4 mt-4' >
                                                                    <label className='flex justify-center' > select showtime </label>
                                                                    <div className='flex flex-wrap gap-3 mt-2 justify-center' >
                                                                        {showTimes.length > 0 ? (

                                                                            showTimes.map((showtime) => (
                                                                            <div
                                                                                key={showtime.id}
                                                                                onClick={() => handleSelectedShowTime(showtime.id)}
                                                                                className={`cursor-pointer px-4 py-2 rounded-lg border ${
                                                                                    selectedShowTime.includes(showtime.id)
                                                                                        ? 'bg-blue-500 text-white border-blue-500'
                                                                                        : 'bg-white text-gray-700 border-gray-300'
                                                                                }`}
                                                                            >
                                                                                
                                                                                {formatTime(showtime.start_time)}
                                                                            </div>
                                                                            ))
                                                                        ) :(

                                                                            <p className='text-red-500' >show time not added</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className='flex justify-center' >

                                                                <Button 
                                                                    className="w-[30%] bg-gray-500 text-white py-2 rounded mt-2"
                                                                    onClick={handleAddShowTime}
                                                                >
                                                                    Add Showtime
                                                                </Button>
                                                               
                                                                     
                                                                    
                                                                </div>
                                                            </div>
                                                        )}
                                                        </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div> 
                                            </td>
                                            <td>
                                                <button className='outline outline-1 py-2 px-2 rounded outline-gray-300'
                                                    onClick={() => navigate(`/theatre-owner/add-showtime/${id}/${screen.id}`)}
                                                >
                                                    <TbClockPlus size={20}  />
                                                </button>
                                            </td>
                                        </tr>
                                        ):(
                                            <tr key={indx} className="border-b hover:bg-gray-50">
                                            <td className='pl-10'>
                                                <Badge className="py-3">
                                                    {screen.screen_number}
                                                </Badge>
                                            </td>
                                            <td className='p-3'>{screen.capacity}</td>
                                            <td className='p-3'>{screen.screen_type}</td>
                                            <div className='flex justify-end' >
                                            <td className='p-3'>
                                                <div className='flex space-x-2' >
                                                    
                                                <button className='border-orange-300 border-2 py-2 px-1 cursor-not-allowed rounded-md' >
                                                    requested 
                                                </button>
                                                    
                                                </div> 
                                            </td>
                                            </div>

                                            <td className='p-3' >
                                            <Dialog>

                                                <DialogTrigger asChild >
                                                    <Button 
                                                        onClick={() => {

                                                         fetchSeatLayout(screen.id);
                                                        
                                                        }}
                                                    >
                                                    
                                                    Seat Layout

                                                    </Button>


                                                </DialogTrigger>

                                                <DialogContent>
 
                                                    <div className='p-4' >

                                                        <DialogTitle className="text-xl font-bold mb-10 text-center" >
                                                            seat Layout
                                                        </DialogTitle>

                                                        <div className='mt-5'>
                                                    <div className='flex flex-wrap gap-2'>
                                                    {Object.entries(seats).map(([row, rowSeats]) => {
                                

                                                        return (
                                                        <div
                                                            key={row}
                                                            className='flex justify-center w-full mb-4'
                                                        >
                                                            <button
                                                            className={`w-6 h-6 font-bold mr-2 rounded cursor-not-allowed`}
                                                            >
                                                            {row}
                                                            </button>

                                                            <div className='flex space-x-1'>
                                                            {rowSeats.map((seat) => (
                                                                seat?.label ? (


                                                                <button
                                                                    type='button'
                                                                    key={seat.id}
                                                                    disabled={true }
                                                                    title={`${seat.category_name || 'No Category'} - ₹${seat.price}`}
                                                           
                                                                
                                                                    className={`w-6 h-6 rounded-sm  flex items-center justify-center text-xs ${getSeatClass}`}
                                                                >
                                                                    {seat.number}
                                                                </button>

                                                                ):(

                                                                <div key={seat.id} className="w-6 h-6"/>
                                                                )
                                                            ))}
                                                            </div>
                                                        </div>
                                                        )
                                                    })}
                                                    <div className="relative mb-8 pb-28 z-0">
                                                    <div className="flex justify-center ">
                                                        <img src={screenimg} className='w-[80%] mt-3' alt="screen image" ></img>
                                                    </div>
                                                    </div>
                                                    </div>

                                                    
                                                </div>




                                                    </div>


                                                </DialogContent>
                                            </Dialog>

                                            </td>
                                            <td className='p-2' >


                                                <button className='outline outline-1 py-2 px-2 rounded outline-gray-300'
                                                    onClick={() => navigate(`/theatre-owner/add-showtime/${id}/${screen.id}`)}
                                                >
                                                    <TbClockPlus size={20}  />
                                                </button>

                                            </td>
                                            </tr>
                                        )
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center p-5">
                                            No screens available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardHeader>
            </Card>
        </div>
    );
}

export default ShowScreen;
