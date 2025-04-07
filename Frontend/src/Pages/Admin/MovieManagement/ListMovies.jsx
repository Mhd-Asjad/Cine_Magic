import React, { useState , useEffect } from 'react'
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import apiAdmin from '../../../Axios/api';
import { Button } from '@/Components/ui/button';
import Swal from 'sweetalert2';
import { CandlestickChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function ListMovies() {
    const navigate = useNavigate();
    const [ movies , setMovies ] = useState([])
    const {toast} = useToast();
    
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
    const handleDelete = async(movie_id) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed){

      try {
        const res = await apiAdmin.delete(`movies/${movie_id}/delete`)
        fetchMovies()
        toast({
          title : res.data.message,
          variant : 'success'
        })
      }catch(e){
        console.log(e.response)
      }
      }
    }

    const handleEdit = (movie_id) => {
      navigate(`/admin/movies/${movie_id}/edit`)
    }
    const addMoviesData = () =>{
        navigate('/admin/addmovies')
    }
    return (
        <div className='min-h-screen bg-gray-100 py-10 mt-10'>
          <div className='container mx-auto px-4'>
            
            <h2 className='mb-8 text-center font-bold text-3xl text-gray-800'>All Movies</h2>
    
            <div className='flex justify-end mb-5'>
              <button 
                className='flex items-center gap-2 bg-green-500 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-green-600 transition'
                onClick={addMoviesData}
              >
                <IoIosAddCircleOutline className='text-xl' /> Add Movie
              </button>
            </div>
    
            <div className='overflow-x-auto bg-white shadow-lg rounded-lg'>
              <table className='w-full table-auto border border-gray-300'>
                <thead>
                  <tr className='bg-blue-500 text-white text-left'>
                    <th className='border border-gray-300 px-4 py-3'>Poster</th>
                    <th className='border border-gray-300 px-4 py-3'>Title</th>
                    <th className='border border-gray-300 px-4 py-3'>Language</th>
                    <th className='border border-gray-300 px-4 py-3'>Duration</th>
                    <th className='border border-gray-300 px-4 py-3'>Release Date</th>
                    <th className='border border-gray-300 px-4 py-3'>Description</th>
                    <th className='border border-gray-300 px-4 py-3'>Genre</th>
                    <th className='border border-gray-300 px-4 py-3'>Action</th>
                  </tr>
                </thead>
                
                <tbody>
                  {movies.map((movie) => (
                    <tr key={movie.id} className='hover:bg-gray-100 transition'>
                      <td className='border border-gray-300 px-4 py-2 text-center'>
                        {movie.poster ? (
                          <img
                            src={movie.poster}
                            alt={`${movie.title} Poster`}
                            className='h-16 w-16 object-cover rounded shadow-md mx-auto'
                          />
                        ) : (
                          <span className='text-gray-500'>No poster</span>
                        )}
                      </td>
                      <td className='border border-gray-300 px-4 py-2'>{movie.title}</td>
                      <td className='border border-gray-300 px-4 py-2'>{movie.language}</td>
                      <td className='border border-gray-300 px-4 py-2'>{movie.duration} min</td>
                      <td className='border border-gray-300 px-4 py-2'>{movie.release_date}</td>
                      <td className='border border-gray-300 px-4 py-2 truncate max-w-xs'>{movie.description}</td>
                      <td className='border border-gray-300 px-4 py-2'>{movie.genre}</td>

                      <td className='flex p-4 gap-3' >
                        <Button className="bg-red-400"
                          onClick={() => handleDelete(movie.id)}
                        >

                          Delete
                        </Button>

                        <Button className="bg-blue-400"
                          onClick={() => handleEdit(movie.id)}
                        >

                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}


                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    };

export default ListMovies
