from django.urls import path
from .views import *

urlpatterns = [
    path("list_cities/", fetchavailablecity.as_view(), name="list_cities"),
    path("fetch_movies/<int:city_id>/", CityBasedMovies.as_view(), name="fetch_movies"),
    path("movie_details/<int:id>/", DetailedMovieView.as_view(), name="movie_details"),
    path("showtimes/<int:id>/", movie_showtime.as_view(), name="movie-showtime"),
    path("show-detail/<int:show_id>/", Show_Details.as_view(), name="show-detail"),
    path("fetchall-citys/", FetchCities.as_view(), name="fetchall-citys"),
    path("get-nearest-citys/", get_nearest_cities.as_view(), name="get-nearest-citys"),
    path(
        "get-multiplecity-movies/",
        multiple_city_based_movies.as_view(),
        name="get-multiplecity",
    ),
]
