from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView ,
    TokenRefreshView
)


urlpatterns = [
    
    path('token/',TokenObtainPairView.as_view(),name="token_obtain_pair"),
    path('token/refresh/', TokenRefreshView.as_view(),name='token_refresh'),
    path('admin/login/', AdminLoginView.as_view(), name='admin_login'),
    path('users/', UserListView.as_view(), name='users'),
    path('users/<int:pk>/status/',UserStatusUpdate.as_view() , name='user_update'),
    path('create_city/',CreateCity.as_view(),name='create_city'),
    # path('city/<int:city_id>/delete',DeleteCity.as_view() , name='city_delete'),
    path('cities/<int:city_id>/theatres'  , CityTheatreView.as_view() , name='city_theatres'),  
    path('listmovies/' ,ListMovies.as_view() , name='listmovies'),
    path('movies/', CreateMovieView.as_view() , name="create_movie"),
    path('movies/<int:movie_id>/update/', update_movie.as_view(), name='update_movie'),
    path('movies/<int:id>/delete' , DeleteMovies.as_view(), name='delete-movie'),
    path('theatre_owners/',ShowTheatreRequest.as_view() , name='theatre-owners') ,
    path('theatre/<int:id>/delete',DeleteTheatre.as_view(),name='delete-theatre')
]