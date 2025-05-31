from django.urls import path 
from .views import *

urlpatterns = [
    path('rate-movie/<int:booking_id>/',PostReview.as_view(),name='rate-movie'),
    path('movie-reviews/<int:movie_id>/', MovieReviews.as_view() , name='movie-reviews'),
    path("chatbot/", ChatBotView.as_view(), name="chatbot"),
    path("faqs/", ListFAQ.as_view(),name='faqs')

]