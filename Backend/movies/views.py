from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status , permissions
import requests
from django.conf import settings
from theatres.models import *
from django.db.models import Count
from datetime import time
from theatre_owner.serializers import FechShowSerializer
from seats.models import *
# Create your views here.

class Fetchcities(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self , request) :
        print(request.user , 'user')
        now = datetime.now()
        theatres = Theatre.objects.annotate(movie_count = Count('screens__showtimes__movie')).filter(movie_count__gte=1 , screens__showtimes__show_date__gte = now).distinct()
        city_data = [{
            
            "id" : theatre.city.id,
            "name" : theatre.city.name, 
            "state" : theatre.city.state ,
            "pincode" : theatre.city.pincode ,
        }
        for theatre in theatres
      
        ]
        return JsonResponse({ "cities" : city_data},safe=False)

class CityBasedMovies(APIView) :
    permission_classes = [permissions.AllowAny]
    def get(self , request , city_id ): 
        try :   
            print(city_id)
            today = datetime.now()
            city = City.objects.get(id = city_id)
            showtimes = ShowTime.objects.filter(screen__theatre__city = city_id ,show_date__gte = today).select_related('movie').distinct()
                        
            movies = {showtime.movie for showtime in showtimes}
            
        except City.DoesNotExist:
            return Response({'detail' : 'city is not found'} , status=status.HTTP_404_NOT_FOUND)
        
        movie_data = [
            
            {
                'id' : movie.id ,
                'title' : movie.title,
                'language': movie.language ,
                'duration' : movie.duration ,
                'release_date' : movie.release_date , 
                'description' : movie.description,
                'genre' : movie.genre,
                'poster' : request.build_absolute_uri(movie.poster.url) if movie.poster else None ,
            }
            for movie in movies
            
        ]
 
        return Response({ 'movies' :movie_data , 'city_id' : city.id , 'location' : city.name} , status=status.HTTP_200_OK)

class DetailedMovieView(APIView) :
    def get(self , request  , id ) :
        print('inside views')
        print(id , 'got the id hrere')
        try :

            movie = Movie.objects.get(id = id)
        except Movie.DoesNotExist :
            return Response({"message" : 'movie does not exist'} , status=status.HTTP_404_NOT_FOUND)
        
        tmdb_url = "https://api.themoviedb.org/3/search/movie"
        tmdb_params = {
            "api_key" : settings.TMDB_API_KEY , 
            "query" : movie.title ,
            "include_adult" : False ,
            "language" : "ml",
            "region" : "IN",
            "page" : 1 , 
        }

        movie_id = 0
        backdrop_url = ''
        try :
            tmdb_response = requests.get(tmdb_url , params=tmdb_params,timeout=10)
            tmdb_response.raise_for_status()
                
            if tmdb_response.status_code == 200 :
                tmdb_data = tmdb_response.json()
                results = tmdb_data.get("results",[])
                print(results[0])
                
                if results :
                    movie_id = results[0]['id']
                    backdrop_url = results[0]['backdrop_path'] or results[0]['poster_path']
        
            print('respose status' ,tmdb_response.status_code)
            movie_data = {
                'movie_id' : movie_id,
                'bg_image' : backdrop_url,
                "title": movie.title,
                "language": movie.language,
                "duration": movie.duration,
                "release_date": movie.release_date,
                "description": movie.description,
                "genre": movie.genre,
                "poster": request.build_absolute_uri(movie.poster.url) if movie.poster else None,
            }
            return JsonResponse(movie_data , safe=False , status=status.HTTP_200_OK)

                    
        except requests.exceptions.RequestException as e:
            print(f'error fetching tmdb data {e}')
            movie_data = {
                "title": movie.title,
                "language": movie.language,
                "duration": movie.duration,
                "release_date": movie.release_date,
                "description": movie.description,
                "genre": movie.genre,
                "poster": request.build_absolute_uri(movie.poster.url) if movie.poster else None,
            }
            return JsonResponse(movie_data , safe=False , status=status.HTTP_200_OK)

def get_showtime_label(start_time):
    if not start_time:
        return ''
    if time(6, 0) <= start_time < time(12, 0):
        return 'Morning'
    elif time(12, 0) <= start_time < time(16, 0):
        return 'Afternoon'
    elif time(16, 0) <= start_time < time(21, 0):
        return 'Evening'
    else:
        return 'Night'


class movie_showtime(APIView):
    def get(self , request  , id):
        cityid = request.GET.get('city_id')
        try:
            movie = Movie.objects.get(id = id)
        except Movie.DoesNotExist:
            return Response({'error' : 'movie not found'} , status=status.HTTP_404_NOT_FOUND)
            
        try :
            showtimes = ShowTime.objects.filter(
                movie = movie,
                screen__theatre__city_id = cityid
            ).select_related(
                'screen__theatre',
                'slot'
            )
            
        except ShowTime :
            return Response({'error' : 'show not available'} , status=status.HTTP_404_NOT_FOUND)
        
        theatre_data = {}
        for show in showtimes :
            theatre_name = show.screen.theatre.name
            if theatre_name not in theatre_data : 
                    
                theatre_data[theatre_name] = {
                    'name' : show.screen.theatre.name,
                    'city' : show.screen.theatre.city.name,
                    'address' : show.screen.theatre.address,
                    'shows' : []
                }
            prices = []   
            unique_prices = seats.objects.filter(
                screen_id = show.screen.id,
                is_seat = True
            ).values('category_id').distinct()
            
            for cat in unique_prices :
                price_range = SeatCategory.objects.get(id=cat['category_id'])
                prices.append(price_range.price)
            label = get_showtime_label(show.slot.start_time)
            theatre_data[theatre_name]['shows'].append({
                    'show_id' : show.id,
                    'show_date': show.show_date,
                    'end_date' : show.end_date,
                    'start_time' : show.slot.start_time.strftime('%H:%M') if show.slot else None ,
                    'end_time' : show.end_time.strftime('%H:%M') if show.end_time else None ,
                    'label' : label ,
                    'price' : prices,
                    
                    'movies_data' : {
                        'language' : show.movie.language ,
                        'relese_date' : show.movie.release_date
                    },
                    'screen' : {
                        'screen_id' : show.screen.id ,
                        'screen_number' : show.screen.screen_number ,
                        'screen_type' : show.screen.screen_type
                    },
            })
        shows = ShowTime.objects.filter(screen__theatre__city = cityid)
        movies = set(show.movie for show in shows)
        movie_data = []
        for movie in movies :
            movie_data.append({
                'id' : movie.id,
                'movie_name' : movie.title,                
            })
        
        return JsonResponse({'movie_title' : movie.title , 'theatres' : list(theatre_data.values()),  'movies' : movie_data},safe=True)     

class Show_Details(APIView):
    def get(self , request , show_id ):
        try :
            show = ShowTime.objects.get(id = show_id)
        except ShowTime.DoesNotExist:
            return Response({'error' : 'show not found'} , status=status.HTTP_404_NOT_FOUND)
        serializer = FechShowSerializer(show)
        return Response(serializer.data , status=status.HTTP_200_OK)
        