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
    path('city/<int:city_id>/delete',DeleteCity.as_view() , name='city_delete'),
    path('cities/<int:city_id>/theatres'  , CityTheatreView.as_view() , name='city_theatres'),
    path('theatre/<int:city_id>/add' ,AddTheatre.as_view() , name='theatre_add'),
    path('theatre/<int:id>/edit' , EditTheatreData.as_view() , name='theatre_edit'),
    path('theatre/<int:id>/delete',DeleteTheatre.as_view() , name='theatre_delete'),
    path('listmovies/' ,ListMovies.as_view() , name='listmovies'),
    path('movies/', CreateMovieView.as_view() , name="create_movie"),
    
]