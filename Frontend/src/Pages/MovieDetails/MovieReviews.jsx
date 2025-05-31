import apiReview from '@/Axios/Reviewapi';
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { format } from "date-fns";

function MovieReviews({ movie_id }) {
    const [reviews , setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async() => {
            try{
                const res = await apiReview.get(`movie-reviews/${movie_id}/`)
                setReviews(res.data)
            }catch(error){
                console.log(error , 'error while review fetch')
            }
        }
        fetchReviews()
    },[])
    console.log(reviews)
  return (
    <div className='p-4 border border-gray-100' >
        <div  className='flex justify-between' >
        <h2 className='text-xl font-bold mb-4'> movie Reviews</h2>
        <a href="#" className="text-sm hover:underline">View All</a>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {reviews.length > 0 ? (
        reviews.map((r, i) => (
            <Card
            key={i}
            className="bg-gradient-to-br from-white via-blue-50 to-blue-100 border-0 shadow-lg rounded-2xl p-4"
            >
            <CardContent>
                <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-800">{r.username}</h2>
                <span className="text-sm text-gray-500">
                    {format(new Date(r.created_at), "dd MMM yyyy")}
                </span>
                </div>

                <div className="flex items-center mb-2">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-yellow-600 font-medium">{r.rating}/5</span>
                </div>

                <p className="text-gray-700">{r.review}</p>
            </CardContent>
            </Card>
        ))

        ):(

        <div className="flex -text-center text-gray-500 p-4">
          No reviews yet.
        </div>


        )}
        </div>
    </div>
  )
}

export default MovieReviews
