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
    DialogHeader, 
    DialogTitle, 

} from '@/components/ui/dialog';
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
import { Eye , X ,  } from 'lucide-react';
import { TbClockPlus } from "react-icons/tb";
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
    const [selectedShowTime , setSelectedShowTime] = useState(null);
    const [ showDetails , setShowDetails ] = useState([]);
    const [ isShowDialogOpen , setIsDialogOpen] = useState(false)
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
    console.log(selectedScreen);

    useEffect(() => {
        const fetchTimeSlot = async() => {
            try{

                const res = await TheatreApi.get(`/get_time-slots/?screen_id=${selectedScreen.id}`);
                setShowTime(res.data);
                    
            }catch(e) {
                console.log(e.response , 'error while fetching show time')
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
        if (!selectedMovie || !selectedScreen || !showDate ) {
            toast({
                title : 'please fill up all fields',
                variant:"destructive"
            })
            return;
        }
        try{
            const res = await TheatreApi.post('/add_show_time/', {
                "screen_number" : selectedScreen.screen_number,
                "movie" : selectedMovie.id,
                'screen' : selectedScreen.id,
                'slot' : selectedShowTime.id,
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
            toast({title : e.response.data?.Error ,
                variant : "destructive",
                action: <ToastAction className='flex border border-light font-semibold rounded py-1 pl-1 pr-1' altText="Try again">Try again</ToastAction>,
            });

            }
    }
    console.log(showTimes)
    const sortedShows = showTimes.sort((a , b) => {
        return a.start_time.localeCompare(b.start_time) 
    })
    
    console.log(sortedShows)
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
    console.log(showTimes)
   
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
                                    <th className='p-3 text-left'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {screens.length > 0 ? (
                                    screens.map((screen, indx) => (
                                        <tr key={indx} className="border-b hover:bg-gray-50">
                                            <td className='pl-9'>
                                                <Badge className="py-3">
                                                    {screen.screen_number}
                                                </Badge>
                                            </td>
                                            <td className='p-3'>{screen.capacity}</td> 
                                            <td className='p-3'>{screen.screen_type}</td> 
                                            <td className='p-3'> 
                                                <div className='flex space-x-2'>

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

                                                    <Dialog>
                                                        <DialogTrigger>
                                                            <Button variant="outline" size="icon" 
                                                            
                                                            >
                                                                <Eye className='h-4 w-2' />
                                                            </Button>

                                                        </DialogTrigger>
                                                        
                                                            <DialogContent className="sm:max-w-xl max-h-screen overflow-y-auto bg-white" >
                                                            <div className="p-4">
                                                                <DialogTitle className="text-xl font-bold mb-4 text-center">

                                                                showtime of Movie (Screen {screen.screen_number})
                                                                </DialogTitle>

                                                  
                                                                    { showDetails.length > 0 ? (
                                                                        
                                                                        <ul className="list-disc pl-5">
                                                                        {showDetails.map((show) => {
                                                        
                                                                            if (show.screen_number == screen.screen_number ) { 

                                                                                return (
                                                                                    <li key={show.id} className="mb-2">
                                                                                        <p>Movie name: {show.movie_name}</p>
                                                                                        <p>Show Date : {show.show_date}</p>
                                                                                        <p>Start Time: {formatTime(show.start_time)}</p>
                                                                                        {/* <p>End Time: {formatTime(show?.end_time)}</p> */}
                                                                                    </li>
                                                                                );
                                                                            }
                                                                            return null  
                                                                            
                                                                        })}
                                                                        </ul>   
                                                                        ) : (
                                                                            <p className="text-center text-gray-500">No showtimes available</p>
                                                                        ) 
                                                                    }
                                                            </div>
                                                        
                                                            </DialogContent>
                                                    </Dialog>
                                                    <DialogContent className="sm:max-w-3xl max-h-screen overflow-y-auto bg-white">
                                                        <DialogTitle className="text-xl font-bold mb-4 text-center" >
                                                        Select a Movie

                                                        </DialogTitle>
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

                                                                            sortedShows.map((showtime) => (
                                                                            <div
                                                                                key={showtime.id}
                                                                                onClick={() => setSelectedShowTime(showtime)}
                                                                                className={`cursor-pointer px-4 py-2 rounded-lg border ${
                                                                                    selectedShowTime?.id === showtime.id
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
