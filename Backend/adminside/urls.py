from django.urls import path
from .views import *


urlpatterns = [

    path('users/', UserListView.as_view(), name='users'),
    path('users/<int:pk>/status/',UserStatusUpdate.as_view() , name='user_update'),
    path('listmovies/' ,ListMovies.as_view() , name='listmovies'),
    path('movies/', CreateMovieView.as_view() , name="create_movie"),
    path('movies/<int:movie_id>/update/', update_movie.as_view(), name='update_movie'),
    path('movies/<int:id>/delete/' , DeleteMovies.as_view(), name='delete-movie'),
    path('theatre_owners/',ShowTheatreRequest.as_view() , name='theatre-owners') ,
    path('theatre/<int:id>/delete/',DeleteTheatre.as_view(),name='delete-theatre'),
    path('verified-theatres/',Verified_Theatres , name='verified_theatres'),
    path('handle-screen/<int:screen_id>/',verify_screen.as_view(),name='handle-screen'),
    path('cancel-show/<int:show_id>/',Cancel_Show , name='cancel-show'),
    path('get-cancelled_booking/', PendingCancelledShows.as_view() , name='get-cancelled_booking')
]