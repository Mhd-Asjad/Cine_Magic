from django.urls import path
from .views import *

urlpatterns = [
    path("rate-movie/<int:booking_id>/", PostReview.as_view(), name="rate-movie"),
    path("movie-reviews/<int:movie_id>/", MovieReviews.as_view(), name="movie-reviews"),
    path("chatbot/", ChatBotView.as_view(), name="chatbot"),
    path("faqs/", ListFAQ.as_view(), name="faqs"),
    path("chat-history/", ChatHistoryView.as_view(), name="chat-history"),
    path("haveanychats/", check_chatlog.as_view(), name="haveanychats"),
    path("complaints/", Raisecomplaint_form.as_view(), name="complaints"),
    path("show-complaints/", ShowComplaints.as_view(), name="show-complaints"),
    path(
        "complaint-detail/<int:complaint_id>/",
        Complaint_details.as_view(),
        name="complaint-detail",
    ),
    path(
        "update-complaint/<int:pk>/",
        ComplaintResponseView.as_view(),
        name="update-complaint",
    ),
]
