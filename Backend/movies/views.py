from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
import requests
from django.conf import settings
from theatres.models import *
# Create your views here.

class Fetchcities(APIView):
    def get(self , request) :
        print(request.user)
        cities = City.objects.all()
        print(cities)
        city_data = [{
            "id" : city.id,
            "name" : city.name,
            "state" : city.state,
            "pincode" : city.pincode
        }
        for city in cities
        ]
        return JsonResponse({ "cities" : city_data},safe=False)

class CityBasedMovies(APIView) :
    def get(self , request , city_id ): 
        try :   
            print(city_id)

            city = City.objects.get(id = city_id)
            showtimes = ShowTime.objects.filter(screen__theatre__city = city_id).select_related('movie').distinct()
            print(showtimes)
            movies = { showtime.movie for showtime in showtimes }       
            
        except City.DoesNotExist:
            return Response({'detail' : 'city is not found'} , status=status.HTTP_404_NOT_FOUND)
        
        print(city.id , 'city')
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

        tmdb_response = requests.get(tmdb_url , params=tmdb_params)
        movie_id = 0
        if tmdb_response.status_code == 200 :
            tmdb_data = tmdb_response.json()
            results = tmdb_data.get("results",[])
            print(results[0])
            
            if results :
                movie_id = results[0]['id']
                
        print('except block')

        movie_data = {
            'movie_id' : movie_id,
            "title": movie.title,
            "language": movie.language,
            "duration": movie.duration,
            "release_date": movie.release_date,
            "description": movie.description,
            "genre": movie.genre,
            "poster": request.build_absolute_uri(movie.poster.url) if movie.poster else None,
        }
        return JsonResponse(movie_data , safe=False , status=status.HTTP_200_OK)



class movie_showtime(APIView):
    def get(self , request  , id):
        cityid = request.GET.get('city_id')
        
        movie = Movie.objects.get(id = id)
        try :
            showtimes = ShowTime.objects.filter(movie = movie).select_related(
                'screen__theatre',
                'slot'
            )
            
        except ShowTime :
            return Response({'error' : 'show not available'} , status=status.HTTP_404_NOT_FOUND)
        # avilable_movies = 
        theatre_data = {}
        for show in showtimes :
            theatre_name = show.screen.theatre.name
            if theatre_name not in theatre_data : 
            
                    
                theatre_data[theatre_name] ={
                    'name' : show.screen.theatre.name,
                    'city' : show.screen.theatre.city.name,
                    'address' : show.screen.theatre.address,
                    'shows' : []
                }
            theatre_data[theatre_name]['shows'].append({
                'show_date': show.show_date,
                    'start_time' : show.slot.start_time.strftime('%H:%M') if show.slot else None ,
                    'end_time' : show.end_time.strftime('%H:%M') if show.end_time else None ,
                    'screen' : {
                        'screen_number' : show.screen.screen_number,
                        'screen_type' : show.screen.screen_type
                    },
            })
            
        shows = ShowTime.objects.filter(screen__theatre__city = cityid)
        movies = set(show.movie for show in shows)
        movie_data = [] 
        for movie in movies :
            movie_data.append({
                'id' : movie.id,
                'movie_name' : movie.title
            })
        
        return JsonResponse({'movie_title' : movie.title , 'theatres' : list(theatre_data.values()),  'movies' : movie_data},safe=True)     