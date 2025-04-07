from django.urls import path
from .views import *

urlpatterns = [
    path('seats-layout/',GetScreenLayout.as_view(), name="seats-layout"),
]