from django.urls import path
from .views import *


urlpatterns = [
    path("users/", UserListView.as_view(), name="users"),
    path("users/<int:pk>/status/", UserStatusUpdate.as_view(), name="user_update"),
    path("listmovies/", ListMovies.as_view(), name="listmovies"),
    path("movies/", CreateMovieView.as_view(), name="create_movie"),
    path("movies/<int:movie_id>/update/", update_movie.as_view(), name="update_movie"),
    path("movies/<int:id>/delete/", DeleteMovies.as_view(), name="delete-movie"),
    path("theatre_owners/", ShowTheatreRequest.as_view(), name="theatre-owners"),
    path("theatre/<int:id>/delete/", DeleteTheatre.as_view(), name="delete-theatre"),
    path("verified-theatres/", Verified_Theatres, name="verified_theatres"),
    path(
        "handle-screen/<int:screen_id>/", verify_screen.as_view(), name="handle-screen"
    ),
    path(
        "toggle-screen-status/<int:pk>/",
        toggle_screen_status,
        name="toggle-screen-status",
    ),
    path(
        "toggle-theatre-status/<int:pk>/",
        toggle_theatre_status,
        name="toggle-theatre-status",
    ),
    path("cancel-show/<int:show_id>/", Cancel_Show, name="cancel-show"),
    path(
        "get-cancelled_booking/",
        PendingCancelledShows.as_view(),
        name="get-cancelled_booking",
    ),
    path("dashboard_view/", dashboard_stats.as_view(), name="total-tickets-sold"),
    path("ticket-trend/", ticket_trend_data.as_view(), name="ticket-chart"),
    path("recent-sales/", RecentSale.as_view(), name="recent-sales"),
    path("revenue-chart/", revenue_chart_data.as_view(), name="revenue-chart"),
    path("report-xldownload/", ExportTheatreReport.as_view(), name="report-xldownload"),
    path("get-active-theatres/", GetTheatres, name="get-active-theatres"),
    path("admin-settings/", AdminSettingsView.as_view(), name="admin-settings"),
    path("change-password/", ChangePassword.as_view(), name="change-password"),
]
