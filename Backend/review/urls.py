from django.urls import path 
from .views import *

urlpatterns = [
    path('rate-movie/<int:booking_id>/',PostReview.as_view(),name='rate-movie')
]