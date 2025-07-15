import { useState } from 'react';
import apiMovies from '@/axios/Moviesapi';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { Star, Calendar, User, MessageCircle } from 'lucide-react';
import Nav from '@/components/navbar/Nav';

function UserReview() {
    const {id} = useParams();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [movie , setMovie] = useState('');
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await apiMovies.get(`get-movie-reviews/${id}/`);
                setMovie(response.data.movie);
                setReviews(response.data.reviews);
            } catch (error) {
                console.error('Error fetching user reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        return (
            <div className="flex items-center">
                {[...Array(fullStars)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                {hasHalfStar && (
                <div className="relative">
                    <Star className="w-4 h-4 text-gray-300" />
                    <div className="absolute inset-0 overflow-hidden w-1/2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                </div>
                )}
                {[...Array(emptyStars)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-gray-300" />
                ))}
                <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
            </div>
            );
    }
    const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

      if (loading) {
        return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading movie reviews...</p>
            </div>
        </div>
        );
    }
    console.log(reviews, 'reviews');

  return (
    <div>
        <Nav/>
        <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Movie Reviews</h1>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            <div className="bg-white rounded-lg shadow-md">
            <div className="border-b border-gray-200 px-6 py-4">
                <h3 className="text-3xl font-semibold text-gray-900 text-center mb-2">{movie}</h3>
            </div>
            <div className="divide-y divide-gray-200">
                {reviews.map((review, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-medium text-gray-900">@{review.user}</h4>
                        <div className="flex items-center space-x-2">
                            {renderStars(review.rating)}
                        </div>
                        </div>
                        
                        <p className="text-gray-700 mb-3 leading-relaxed">{review.review}</p>
                        
                        <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(review.created_at.replace(' ', 'T')).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>

            {/* No Reviews State */}
            {reviews.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600">Be the first to share your thoughts about this movie!</p>
            </div>
            )}
        </div>
        </div>
    </div>
  );
};

export default UserReview
