from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
import requests
from django.conf import settings

# Create your views here.

class Fetchcities(APIView):
    def get(self , request) :
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

            city = City.objects.get(id = city_id)
            print(city.name)

        except City.DoesNotExist:
            return Response({'detail' : 'city is not found'} , status=status.HTTP_404_NOT_FOUND)
        

        movies = city.movies.all()

        movie_data = [

            {
                'id' : movie.id ,
                'title' : movie.title,
                'language': movie.language ,
                'duration' : movie.duration ,
                'release_date' : movie.release_date , 
                'description' : movie.description,
                'genre' : movie.genre,
                'poster' : request.build_absolute_uri(movie.poster.url) if movie.poster else None,
            }
            for movie in movies
        ]

        return Response({ 'movies' :movie_data , 'location' : city.name} , status=status.HTTP_200_OK)


class DetailedMovieView(APIView) :
    def get(self , reqeust , id ) :

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
            "poster": reqeust.build_absolute_uri(movie.poster.url) if movie.poster else None,
            "cities" : [ city.name for city in movie.cities.all()]
        }
        return JsonResponse(movie_data , safe=False , status=status.HTTP_200_OK)

