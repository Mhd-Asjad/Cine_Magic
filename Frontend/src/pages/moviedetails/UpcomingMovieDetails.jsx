import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, Calendar, Globe, Clock, Share2, User , Bookmark } from 'lucide-react';
import Nav from '@/components/navbar/Nav';
const UpcomingMovieDetails = () => {
  const { movieId } = useParams(); 
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log(crew)
  useEffect(() => {
    const fetchMovieData = async () => {
      if (!movieId) return;
      
      setLoading(true);
      setError(null);

      try {
        const options = {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ODExYWI5MTExYWRlZWMxN2UyMzk0Zjg1OTE3OTM4YiIsIm5iZiI6MTcyNTc3NDY1OS4xNTY5OTk4LCJzdWIiOiI2NmRkM2I0MzU0YWYwZTE3MGUzOGJlMWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.uOfHGjAWVEJgIZsds9hX1-hW7DoYtJVs9iupSj-OFdc'
          }
        };

        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?language=ml-IN`,
          options
        );
        
        if (!movieResponse.ok) {
          throw new Error('Movie not found');
        }
        
        const movieData = await movieResponse.json();
        setMovie(movieData);

        const creditsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ml-IN`,
          options
        );
        
        if (creditsResponse.ok) {
          const creditsData = await creditsResponse.json();
          setCast(creditsData.cast?.slice(0, 12) || []);
          setCrew(creditsData.crew?.filter(person => 
            ['Director', 'Producer', 'Screenplay', 'Writer', 'Music', 'Cinematography', 'Editor'].includes(person.job)
          ).slice(0, 8) || []);
        }

      } catch (err) {
        setError(err.message);
        console.error('Error fetching movie data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  const getStarRating = (rating) => {
    const stars = [];
    const normalizedRating = rating / 2; 
    const fullStars = Math.floor(normalizedRating);
    const hasHalfStar = normalizedRating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
    }
    for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
      stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Movie not found'}</p>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : movie.poster_path 
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : null;

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;


  return (
    <div>
        <Nav/>

          <div className="min-h-screen bg-gray-50">
    
          <div className="relative h-64 md:h-96 lg:h-[500px] overflow-hidden bg-gray-900">
              {backdropUrl && (
              <>
                  <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${backdropUrl})` }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60" />
              </>
              )}
              
              <div className="relative z-10 flex items-center justify-between p-4 text-white">
              <button 
                  onClick={handleBack}
                  className="flex items-center space-x-2 bg-black bg-opacity-50 px-3 py-2 rounded-lg hover:bg-opacity-70 transition-all"
              >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Back</span>
              </button>
              <div className="flex space-x-3">
                 
                  <button className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all">
                  <Share2 className="w-5 h-5" />
                  </button>
              </div>
              </div>
            
              <div className="absolute w-full p-4 md:p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
                  {posterUrl && (
                  <img
                      src={posterUrl}
                      alt={movie.title}
                      className="w-32 h-48 md:w-48 md:h-72 object-cover rounded-lg shadow-2xl mx-auto md:mx-0 flex-shrink-0"
                      onError={(e) => {
                      e.target.style.display = 'none';
                      }}
                  />
                  )}
                  <div className="flex-1 text-center md:text-left min-w-0">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                      {movie.title}
                  </h1>
                  {movie.original_title !== movie.title && (
                      <p className="text-lg text-gray-200 mb-3">
                      {movie.original_title}
                      </p>
                  )}
                  
                  {/* Rating */}
                  {movie.vote_average > 0 && (
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
                      <div className="flex items-center space-x-1">
                          {getStarRating(movie.vote_average)}
                          <span className="ml-2 text-sm font-medium">{movie.vote_average.toFixed(1)}/10</span>
                      </div>
                      <span className="text-sm text-gray-300">({movie.vote_count} votes)</span>
                      </div>
                  )}
  
                  {/* Movie Info */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm mb-4">
                      <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}</span>
                      </div>
                      {movie.runtime && (
                      <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatRuntime(movie.runtime)}</span>
                      </div>
                      )}
                      <div className="flex items-center space-x-1">
                      <Globe className="w-4 h-4" />
                      <span>{movie.original_language?.toUpperCase()}</span>
                      </div>
                      {movie.adult && (
                      <span className="px-2 py-1 bg-red-600 rounded text-xs font-medium">18+</span>
                      )}
                  </div>
                    
                  {/* Genres */}
                  {movie.genres && movie.genres.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                      {movie.genres.map(genre => (
                          <span key={genre.id} className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                          {genre.name}
                          </span>
                      ))}
                      </div>
                  )}
  
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                
                      <button className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-medium transition-colors">
                      <Bookmark className="w-5 h-5" />
                      <span>Watchlist</span>
                      </button>
                  </div>
                  </div>
              </div>
              </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                {movie.overview && (
                <section className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Overview</h2>
                    <p className="text-gray-600 leading-relaxed text-base">{movie.overview}</p>
                    {movie.tagline && (
                    <p className="text-sm text-gray-500 italic mt-4 border-l-4 border-gray-300 pl-4">
                        "{movie.tagline}"
                    </p>
                    )}
                </section>
                )}

                {cast.length > 0 && (
                <section className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Top Cast</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {cast.map(person => (
                        <div key={person.id} className="text-center group">
                        <div className="relative overflow-hidden rounded-lg mb-2">
                            <img
                            src={person.profile_path 
                                ? `https://image.tmdb.org/t/p/w185${person.profile_path}` 
                                : `https://via.placeholder.com/185x278/e5e7eb/6b7280?text=${person.name.charAt(0)}`
                            }
                            alt={person.name}
                            className="w-full h-32 object-cover bg-gray-200 group-hover:scale-105 transition-transform duration-200"
                            />
                        </div>
                        <h3 className="font-medium text-sm text-gray-800 truncate" title={person.name}>
                            {person.name}
                        </h3>
                        <p className="text-xs text-gray-500 truncate" title={person.character}>
                            {person.character}
                        </p>
                        </div>
                    ))}
                    </div>
                </section>
                )}

                {/* crew */}
                {crew.length > 0 && (
                <section className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Key Crew</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {crew.map((person, index) => (
                        <div key={`${person.id}-${person.job}-${index}`} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                        <img
                            src={person.profile_path 
                            ? `https://image.tmdb.org/t/p/w92${person.profile_path}` 
                             : `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=E5E7EB&color=6B7280&size=92`
                            }
                            alt={person.name}
                            className="w-12 h-12 object-cover rounded-full bg-gray-200"
                        />
                        <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-gray-800 truncate">{person.name}</h3>
                            <p className="text-sm text-gray-500 truncate">{person.job}</p>
                        </div>
                        </div>
                    ))}
                    </div>
                </section>
                )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Movie Stats */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Movie Details</h3>
                <div className="space-y-4">
                    <div>
                    <span className="text-sm font-medium text-gray-500 block">Release Date</span>
                    <p className="text-gray-800 font-medium">{formatDate(movie.release_date)}</p>
                    </div>
                    
                    {movie.runtime && movie.runtime > 0 && (
                    <div>
                        <span className="text-sm font-medium text-gray-500 block">Runtime</span>
                        <p className="text-gray-800 font-medium"> {formatRuntime(movie.runtime)}</p>
                    </div>
                    )}
                    
                    <div>
                    <span className="text-sm font-medium text-gray-500 block">Status</span>
                    <p className="text-gray-800 font-medium">{movie.status || 'Released'}</p>
                    </div>
                    
                    <div>
                    <span className="text-sm font-medium text-gray-500 block">Original Language</span>
                    <p className="text-gray-800 font-medium">{movie.original_language?.toUpperCase()}</p>
                    </div>

                    {movie.budget > 0 && (
                    <div>
                        <span className="text-sm font-medium text-gray-500 block">Budget</span>
                        <p className="text-gray-800 font-medium">{formatCurrency(movie.budget)}</p>
                    </div>
                    )}

                    {movie.revenue > 0 && (
                    <div>
                        <span className="text-sm font-medium text-gray-500 block">Revenue</span>
                        <p className="text-gray-800 font-medium">{formatCurrency(movie.revenue)}</p>
                    </div>
                    )}

                    {movie.popularity && (
                    <div>
                        <span className="text-sm font-medium text-gray-500 block">Popularity</span>
                        <p className="text-gray-800 font-medium">{movie.popularity.toFixed(1)}</p>
                    </div>
                    )}
                </div>
                </div>

                {/* Production Companies */}
                {movie.production_companies && movie.production_companies.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">Production</h3>
                    <div className="space-y-3">
                    {movie.production_companies.map(company => (
                        <div key={company.id} className="flex items-center space-x-3">
                        {company.logo_path ? (
                            <img
                            src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                            alt={company.name}
                            className="w-8 h-8 object-contain"
                            />
                        ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">{company.name.charAt(0)}</span>
                            </div>
                        )}
                        <span className="text-sm text-gray-700">{company.name}</span>
                        </div>
                    ))}
                    </div>
                </div>
                )}

                {/* Countries */}
                {movie.production_countries && movie.production_countries.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">Countries</h3>
                    <div className="space-y-2">
                    {movie.production_countries.map(country => (
                        <p key={country.iso_3166_1} className="text-sm text-gray-700">
                        {country.name}
                        </p>
                    ))}
                    </div>
                </div>
                )}

                {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">Languages</h3>
                    <div className="space-y-2">
                    {movie.spoken_languages.map(language => (
                        <p key={language.iso_639_1} className="text-sm text-gray-700">
                        {language.english_name}
                        </p>
                    ))}
                    </div>
                </div>
                )}
            </div>
            </div>
        </div>
        </div>
    </div>
  );
};

export default UpcomingMovieDetails;