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
        print()
        print(id , 'got the id hrere')
        try :

            movie = Movie.objects.get(id = id)
        except Movie.DoesNotExist :
            return Response({"message" : 'movie does not exist'} , status=status.HTTP_404_NOT_FOUND)
        
        # tmdb_url = "https://api.themoviedb.org/3/search/movie"
        # tmdb_params = {
        #     "api_key" : settings.TMDB_API_KEY , 
        #     "query" : movie.title ,
        #     "include_adult" : False ,
        #     "language" : "ml",
        #     "region" : "IN",
        #     "page" : 1 , 
        # }

        # tmdb_response = requests.get(tmdb_url , params=tmdb_params)

        # if tmdb_response.status_code == 200 :
        #     tmdb_data = tmdb_response.json()
        #     results = tmdb_data.get("results",[])
        #     print(results[0])
        #     if results :
        #         return JsonResponse(results[0],safe=False)

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



class movie_showtime(APIView):
    def get(self , request  , movie_id):
        print('get inside show details view')
        movie = Movie.objects.get(id = movie_id)
        try :
            showtimes = ShowTime.objects.filter(movie = movie).select_related(
                'screen__theatre',
                'slot'
            )
            
        except ShowTime :
            return Response({'error' : 'show not available'} , status=status.HTTP_404_NOT_FOUND)
    
        data = []
       
        for show in showtimes :
            data.append({
                'show_date': show.show_date,
                'start_time' : show.slot.start_time.strftime('%H:%M') if show.slot else None ,
                'end_time' : show.end_time.strftime('%H:%M') if show.end_time else None ,
                'screen' : {
                    'screen_number' : show.screen.screen_number,
                    'screen_type' : show.screen.screen_type
                },
                'theatre' : {
                    'name' : show.screen.theatre.name,
                    'city' : show.screen.theatre.city.name,
                    'address' : show.screen.theatre.address
                }
                
            })
        return JsonResponse({'movie_title' : movie.title , 'show_times' : data},safe=True)