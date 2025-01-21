from django.urls import path
from .views import *
urlpatterns = [
    path('list_cities/', Fetchcities.as_view() , name='list_cities'),
    path('fetch_movies/<int:city_id>/', CityBasedMovies.as_view() , name='fetch_movies'),
    path('movie_details/<int:id>/', DetailedMovieView.as_view(), name='movie_details')
]