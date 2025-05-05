from django.urls import path
from .views import *

urlpatterns = [
    path('create-post/<int:user_id>/', CreatePostView.as_view(),name='create-post'),
    
]