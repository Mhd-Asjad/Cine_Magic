from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView ,
    TokenRefreshView
)
urlpatterns = [ 
    path('token/',TokenObtainPairView.as_view(),name="token_obtain_pair"),
    path('token/refresh/', TokenRefreshView.as_view(),name='token_refresh'),
    path('create_profile/' , CreateOwnershipProfile.as_view() , name='create_profile'),
    path('update-profile/<int:pk>/',Update_theatreowner.as_view(),name='update-profile'),
    path('theatreowners/' , ConfirmTheatreOwner.as_view() , name='theatreowners'),
    path('theatre-login/', TheatreLogin.as_view() , name='theatre_login'),
    path('validate-owner/' , validateowner.as_view() , name='validate-owner'),
    path('fetchmovies/' , FetchAllMovies.as_view() , name='fetch-movies'),
    path('pending-theatre/',pending_theatres.as_view() , name='pending-theatre'),
    path('add-screen/', CreateScreen.as_view() , name='add-screen'),
    path('show-available/' , ShowVerifiedTheatre.as_view() , name='show-available'),
    path('show-screens/', get_theatre_screens.as_view() , name='show-screens'),
    path('showtime/<int:theatre_id>/', fetch_showtime.as_view() , name='showtime'),
    path('get_time-slots/', get_timeslots.as_view(),name='time-slot'),
    path('add_show_time/',Add_Show_Time.as_view(), name='add_show_time'),
    path('theatre/<int:city_id>/add' ,AddTheatre.as_view() , name='theatre_add'),
    path('theatre/<int:id>/edit' , EditTheatreData.as_view() , name='theatre_edit'),
    path('theatre/<int:id>/delete',DeleteTheatre.as_view() , name='theatre_delete'),

]