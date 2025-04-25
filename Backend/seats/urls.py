from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView ,
    TokenRefreshView
)

urlpatterns = [
    path('token/',TokenObtainPairView.as_view(),name="token_obtain_pair"),
    path('token/refresh/', TokenRefreshView.as_view(),name='token_refresh'),
    path('seats-layout/',GetScreenLayout.as_view(), name="seats-layout"),
    path('add-layout/' , create_layout.as_view() , name='add-layout'),
    path('screen-layout/<int:owner_id>/' , get_theatre_screenlayout.as_view() , name='screen-layout'),
    path('screens/<int:screen_id>/seats/' , get_screen_seats.as_view() , name='screeen-seats'),
    path('get-theatre-screen/<int:id>/' , get_theatre_screens.as_view(),name='theatre-screen'),
    path('get-seats-category/' , get_seats_category.as_view() , name='seats-category'),
    path('update-seats-category/' , update_seats_category.as_view() , name="update-seats-category"),
    path('lock-seats/', Lock_seats.as_view() , name='lock-seats'),
    path('unlock-seats/',Unlock_Seats.as_view() , name='unlock-seats'),
]