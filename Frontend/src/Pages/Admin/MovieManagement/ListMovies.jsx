import React, { useState , useEffect } from 'react'
import { IoIosAddCircleOutline } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import apiAdmin from '../../../Axios/api';
import { Button } from '@/Components/ui/button';
import Swal from 'sweetalert2';
import { CandlestickChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SearchBar from '@/Components/search/SearchBar';

function ListMovies() {
    const navigate = useNavigate();
    const [ movies , setMovies ] = useState([])
    const [searchTerm , setSearchTerm ] = useState('');
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
        navigate('/admin/add-movies')
    }

    const searchMovies = movies.filter(movie => {
      return movie.title.toLowerCase().includes(searchTerm.toLocaleLowerCase())
    })

    return (
      <div className="min-h-screen bg-gray-100 py-10  mt-8 px-4 md:ml-64">
        <h2 className="mb-8 text-center font-bold text-3xl text-gray-800">All Movies</h2>
      

        <SearchBar

          placeholder='Search by movie title'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        
        />
        <div className="flex justify-end mb-5">
          <button
            onClick={addMoviesData}
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-md shadow-md transition"
          >
            <IoIosAddCircleOutline className="text-xl" />
            Add Movie
          </button>
        </div>
  
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
          <table className="min-w-full table-auto border border-gray-200 text-sm sm:text-base">
            <thead>
              <tr className="bg-blue-600 text-white text-left">
                <th className="border px-4 py-3">Poster</th>
                <th className="border px-4 py-3">Title</th>
                <th className="border px-4 py-3">Language</th>
                <th className="border px-4 py-3">Duration</th>
                <th className="border px-4 py-3">Release Date</th>
                <th className="border px-4 py-3">Description</th>
                <th className="border px-4 py-3">Genre</th>
                <th className="border px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {searchMovies.length > 0 ?(




              searchMovies.map((movie) => (
                <tr key={movie.id} className="hover:bg-gray-50 transition">
                  <td className="border px-4 py-2 text-center">
                    {movie.poster ? (
                      <img
                        src={movie.poster}
                        alt={`${movie.title} Poster`}
                        className="h-16 w-16 object-cover rounded shadow mx-auto"
                      />
                    ) : (
                      <span className="text-gray-400">No poster</span>
                    )}
                  </td>
                  <td className="border px-4 py-2">{movie.title}</td>
                  <td className="border px-4 py-2">{movie.language}</td>
                  <td className="border px-4 py-2">{movie.duration} min</td>
                  <td className="border px-4 py-2">{movie.release_date}</td>
                  <td className="border px-4 py-2 truncate max-w-xs">{movie.description}</td>
                  <td className="border px-4 py-2">{movie.genre}</td>
                  <td className="border px-4 py-2 flex flex-col sm:flex-row justify-center gap-2">
                    <button
                      onClick={() => handleDelete(movie.id)}
                      className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded shadow-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEdit(movie.id)}
                      className="bg-gray-900 hover:bg-gray-700 text-white px-4 py-2 rounded shadow-sm"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ):(
              <div className='flex justify-center' >

                <p className='font-semibold text-red-400' >No movies found</p>

              </div>

            )
            }
            </tbody>
          </table>
        </div>
      </div>
    );
  
    };

export default ListMovies
