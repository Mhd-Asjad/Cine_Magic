from django.urls import path
from .views import *

urlpatterns = [
    path('create-post/<int:user_id>/', CreatePostView.as_view(),name='create-post'),
    path('get-posts/<int:user_id>/', GetUserPostsView.as_view(),name='get-posts'),
    path('edit-post/<int:post_id>/',EditPost.as_view() , name='edit-post'),
    path('delete-post/<int:post_id>/',DeletePost.as_view() , name='delete-post'),
    path('get-post/',GetAllPosts.as_view() , name='get-post'),
    path('get-postdetails/<int:id>/',GetPostDetail.as_view(),name="get-postdetails"),
    path('create-comment/<int:post_id>/',PostComment.as_view(),name='create-comment'),
    path('handle-like/<int:post_id>/like/' , toggle_like.as_view() , name='handle-like'),
    path('handle-like/<int:post_id>/dislike/' , toggle_dislike.as_view() , name='handle-like'),
    path('post-reaction/<int:post_id>/', get_post_reaction.as_view(),name='post-reaction')
]