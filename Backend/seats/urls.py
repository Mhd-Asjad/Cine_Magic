from django.urls import path
from .views import *

urlpatterns = [
    path('seats-layout/',GetScreenLayout.as_view(), name="seats-layout"),
    path('screen-layout/<int:owner_id>/' , get_theatre_screenlayout.as_view() , name='screen-layout')
]