from django.urls import path
from .views import *

urlpatterns = [
    path('create-post/<int:user_id>/', CreatePostView.as_view(),name='create-post'),
    path('get-posts/<int:user_id>/', GetUserPostsView.as_view(),name='get-posts'),
    path('edit-post/<int:post_id>/',EditPost.as_view() , name='edit-post')
]