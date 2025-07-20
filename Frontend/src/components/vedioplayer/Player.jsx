import React, { useState , useEffect } from 'react'
import axios from 'axios'
import { X , Film  } from 'lucide-react';

const tmdb_api_key = import.meta.env.VITE_TMDB_API_KEY
console.log(tmdb_api_key)

function Player({videoId , closeModal}) {
    const [videoData , setVideoData ] = useState(null);
    const [loading , setLoading] = useState(false)

    useEffect(() => {
        const fetchVideoData = async () => {
        if (!videoId) return;

        setLoading(true)
        try {
            const options = {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${tmdb_api_key}`
            },
            };

            const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${videoId}/videos?language=en-US`,
            options
            );
            const video = response.data.results?.[0];
            console.log('vedios response: ', video)
            if (video) {
            setVideoData(video);
            }
        } catch (error) {
            console.error('Error fetching video data:', error);
        }finally{
            setLoading(false)
        }
        };
        fetchVideoData();

    },[videoId]);

    useEffect(() => {
        console.log(videoData);
    }, [videoData]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 "><Film className='inline mb-1'/> Watch Trailer</h2>
          <button
            onClick={closeModal}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {loading ? (
            <div className="flex items-center justify-center h-64">
                <span className="text-gray-500 text-lg animate-pulse">Loading trailer...</span>
            </div>

        ):(
         
            videoData && (
            <>
                <div className="relative bg-black">
                <div className="aspect-video">
                    <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoData.key}`}
                    title={videoData.name}
                    frameBorder="0"
                    allowFullScreen
                    ></iframe>
                </div>
                </div>

                <div className="p-6 bg-white">
                <div className="space-y-3">
                    <div>
                    <span className="text-sm font-medium text-gray-600">Published Date:</span>
                    <span className="ml-2 text-gray-900">
                        {new Date(videoData.published_at).toLocaleDateString()}
                    </span>
                    </div>

                    <div>
                    <span className="text-sm font-medium text-gray-600">Name:</span>
                    <span className="ml-2 text-gray-900">{videoData.name}</span>
                    </div>

                    <div>
                    <span className="text-sm font-medium text-gray-600">Type:</span>
                    <span className="ml-2 text-gray-900">{videoData.type}</span>
                    </div>
                </div>
                </div>
            </>
            )
        )}
      </div>
    </div>
  )
}

export default Player