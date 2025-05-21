import axios from 'axios';
import React, { useEffect, useState } from 'react'

function CastCards({movie_id , castLength=0}) {
    const [ casts , setCasts ] = useState([]);
    useEffect(() => {
        const getCredits = async() => {

            try {
             
    
                const res = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}/credits?language=en-US`,{
                    headers: {
                        accept: 'application/json',
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ODExYWI5MTExYWRlZWMxN2UyMzk0Zjg1OTE3OTM4YiIsIm5iZiI6MTcyNTc3NDY1OS4xNTY5OTk4LCJzdWIiOiI2NmRkM2I0MzU0YWYwZTE3MGUzOGJlMWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.uOfHGjAWVEJgIZsds9hX1-hW7DoYtJVs9iupSj-OFdc'
                    }
                })
                setCasts(res.data.cast)
                
                 
            }catch(e){
                console.log(e)
            }

        };
        if (movie_id) {

            getCredits()
        }
        console.log(casts)
        if (casts.length > 0){
          castLength(casts.length)
        }
        
    },[movie_id])
    return (
    <div>
        <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Top Cast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {casts.slice(0, 8).map((cast, index) => (
          <div
            key={index}
            className="overflow-hidden flex flex-col items-center"
          >
            <img
              src={ 
                cast.profile_path
                  ? `https://image.tmdb.org/t/p/w300${cast.profile_path}`
                  : 'https://via.placeholder.com/300x450?text=No+Image'
              }
              alt={cast.name}
              className="w-[100px]  h-[100px] rounded-full rounded-4xl mb-4"
            />
            <h3 className="text-sm font-medium text-center">{cast.name}</h3>
            <p className="text-xs text-gray-500 text-center">{cast.character}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}

export default CastCards
