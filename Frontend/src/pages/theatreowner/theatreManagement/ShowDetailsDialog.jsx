import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Eye, X, Terminal, ChevronDown, ChevronUp, Calendar, Clock, Film } from 'lucide-react';

// Individual Show Item Component (inside a movie group)
const ShowItem = ({ show, onCancel, formatTime }) => {
  return (
    <div className="border-l-4 border-blue-200 bg-gray-50 p-4 ml-4 mb-3 rounded-r-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4 text-sm text-gray-700 mb-3">
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {show.show_date}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {show.showtimes.length} show{show.showtimes.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="mb-3">
            <h5 className="font-medium text-gray-900 mb-2">Show Times</h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {show.showtimes.map((time, index) => (
                <div 
                  key={index}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium text-center"
                >
                  {formatTime(time.start_time)}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCancel(show.id)}
          className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-4"
        >
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  );
};

// Collapsible Movie Group Component
const CollapsibleMovieGroup = ({ movieName, shows, poster, onCancel, formatTime }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate total shows across all dates
  const totalShows = shows.reduce((sum, show) => sum + show.showtimes.length, 0);
  const totalDates = shows.length;

  return (
    <div className="border rounded-lg mb-4 overflow-hidden shadow-sm">
      {/* Movie Header - Always visible */}
      <div 
        className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 cursor-pointer transition-all duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Movie Poster Thumbnail */}
            <div className="flex-shrink-0">
              <img 
                className="w-16 h-20 object-cover rounded-lg shadow-md" 
                src={poster} 
                alt={`${movieName} poster`}
              />
            </div>
            
            {/* Movie Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{movieName}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {totalDates} date{totalDates !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {totalShows} show{totalShows !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            {isExpanded ? (
              <ChevronUp className="h-6 w-6 text-gray-400" />
            ) : (
              <ChevronDown className="h-6 w-6 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Expandable Content - All shows for this movie */}
      {isExpanded && (
        <div className="p-4 bg-white border-t">
          <div className="space-y-1">
            {shows.map((show) => (
              <ShowItem
                key={show.id}
                show={show}
                onCancel={onCancel}
                formatTime={formatTime}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component
const ShowDetailsDialog = ({ 
  sortedShowDetails, 
  screen, 
  message, 
  setMessage, 
  handleCancel, 
  formatTime 
}) => {
  // More flexible filtering - handle both string and number comparisons
  const screenShows = sortedShowDetails.filter(show => 
    show.screen_number == screen.screen_number || 
    String(show.screen_number) === String(screen.screen_number)
  );
  
  // Group shows by movie name
  const groupedByMovie = screenShows.reduce((acc, show) => {
    if (!acc[show.movie_name]) {
      acc[show.movie_name] = {
        shows: [],
        poster: show.poster
      };
    }
    acc[show.movie_name].shows.push(show);
    return acc;
  }, {});
  
  // Convert to array and sort by movie name
  const movieGroups = Object.entries(groupedByMovie)
    .map(([movieName, data]) => ({
      movieName,
      shows: data.shows.sort((a, b) => new Date(a.show_date) - new Date(b.show_date)), // Sort shows by date
      poster: data.poster
    }))
    .sort((a, b) => a.movieName.localeCompare(b.movieName)); // Sort movies alphabetically

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        {message && (
          <Alert 
            className="cursor-pointer hover:bg-gray-100 hover:border-gray-300 mt-3" 
            onClick={() => setMessage('')}
          >
            <Terminal className="h-4 w-4" />
            <AlertTitle>Alert</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="p-4">
          <DialogTitle className="text-xl font-bold mb-6 text-center">
            Movies on Screen {screen.screen_number}
          </DialogTitle>

          {movieGroups.length > 0 ? (
            <div className="space-y-2">
              {movieGroups.map((movieGroup) => (
                <CollapsibleMovieGroup
                  key={movieGroup.movieName}
                  movieName={movieGroup.movieName}
                  shows={movieGroup.shows}
                  poster={movieGroup.poster}
                  onCancel={handleCancel}
                  formatTime={formatTime}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Film className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Shows Available
              </h3>
              <p className="text-gray-600">
                There are currently no shows scheduled for Screen {screen.screen_number}.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowDetailsDialog;