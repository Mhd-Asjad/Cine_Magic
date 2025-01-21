import React, { useState , useEffect } from 'react'
import Sidebar from '../../../Components/Admin/Sidebar'
import Navbar from '../../../Components/Admin/Navbar'
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import apiAdmin from '../../../Axios/api';


function ListMovies() {
    const navigate = useNavigate();
    const [ movies , setMovies ] = useState([])
    
    useEffect(() => {
        fetchMovies()
        console.log(movies)
    },[])

    const fetchMovies = async() => {
        try {
            const res = await apiAdmin.get('listmovies/')
            setMovies(res.data)
        }catch(e){
            console.log('error fetching movies', e)
        }
    } 

    const addMoviesData = () =>{
        navigate('/dashboard/movies/addmovies')
    }
  return (
    <div className='flex min-h-screen bg-gray-100' >
        <div className="w-64 bg-gray-800 text-white">
            <Sidebar/>

        </div>

        <div className='flex-1' >

            <Navbar/>

            <div className='p-5 py-10' >

                <h2 className='mb-6 flex justify-center pt-12 px-3 font-semibold text-3xl text-black-500' > All Movies</h2>

            <div className='overflow-x-auto' >

                <div className='flex justify-end px-4 mb-5' >

                    <button className='flex mb-2 justify-end items-center gap-1 border rounded-md py-1 px-3 border-green-300 font-semibold'
                        onClick={addMoviesData}
                    >
                       <IoIosAddCircleOutline className='text-2xl'/> Add

                    </button>

                </div>

                    <table className='w-full table-auto border-collapse border border-gray-400' >
                        <thead>
                            <tr>

                                <th className='border border-gray-500 px-4 py-3 bg-blue-200' >poster</th>
                                <th className='border border-gray-500 px-4 py-3 bg-blue-200' >title</th>
                                <th className='border border-gray-500 px-4 py-3 bg-blue-200' >language</th>
                                <th className='border border-gray-500 px-4 py-3 bg-blue-200' >duration</th>
                                <th className='border border-gray-500 px-4 py-3 bg-blue-200' >release date</th>
                                <th className='border border-gray-500 px-4 py-3 bg-blue-200' >description</th>
                                <th className='border border-gray-500 px-4 py-3 bg-blue-200' >genre</th>
                                <th className='border border-gray-500 px-4 py-3 bg-blue-200' >Action</th>

                            </tr>

                            

                        </thead>

                        <tbody>

                            {movies.map((movie) => (
                                <tr key={movie.id} className='' >
                                    <td className='border border-gray-600 px-4 py-2' >

                                    {movie.poster ? (
                                        <img
                                            src={movie.poster} 
                                            alt={`${movie.title} Poster`}
                                            className="mx-auto h-[20%] w-[25%] object-cover rounded"
                                        />
                                    ) : (
                                        <span>No poster available</span>
                                    )}
                                    </td>
                                    <td className='border border-gray-600 px-4 py-2' >{movie.title}</td>
                                    <td className='border border-gray-600 px-4 py-2' >{movie.language}</td>
                                    <td className='border border-gray-600 px-4 py-2' >{movie.duration}</td>
                                    <td className='border border-gray-600 px-4 py-2' >{movie.release_date}</td>
                                    <td className='border border-gray-600 px-4 py-2' >{movie.description}</td>
                                    <td className='border border-gray-600 px-4 py-2' >{movie.genre}</td>


                                </tr>
                            ))

                            }
                        </tbody>
                        

                    </table>


            </div>

            </div>

        </div>
    </div>
  )
}

export default ListMovies
