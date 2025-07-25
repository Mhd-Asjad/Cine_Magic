from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("create_profile/", CreateOwnershipProfile.as_view(), name="create_profile"),
    path(
        "update-profile/<int:pk>/", Update_theatreowner.as_view(), name="update-profile"
    ),
    path(
        "theatreowners/restore/",
        RestoreTheatreOwner.as_view(),
        name="restore_theatre_owner",
    ),
    path("theatreowners/", ConfirmTheatreOwner.as_view(), name="theatreowners"),
    path("validate-owner/", validateowner.as_view(), name="validate-owner"),
    path("fetchmovies/", FetchAllMovies.as_view(), name="fetch-movies"),
    path(
        "pending-theatre/<int:owner_id>/",
        pending_theatres.as_view(),
        name="pending-theatre",
    ),
    path("add-screen/", CreateScreen.as_view(), name="add-screen"),
    path('remove-screen/<int:pk>/',delete_screen.as_view(),name='remove-screen'),
    path("show-available/", ShowVerifiedTheatre.as_view(), name="show-available"),
    path("show-screens/", get_theatre_screens.as_view(), name="show-screens"),
    path("showtime/<int:theatre_id>/", fetch_showtime.as_view(), name="showtime"),
    path("get_time-slots/", get_timeslots.as_view(), name="time-slot"),
    path("add-timeslot/", create_timeslot.as_view(), name="add-timeslot"),
    path("edit-show/<int:slot_id>/", Edit_show_det.as_view(), name="edit-show"),
    path("add-showtime/", Add_Show_Time.as_view(), name="add-showtime"),
    path("theatre/<int:city_id>/add/", AddTheatre.as_view(), name="theatre_add"),
    path("theatre/<int:id>/edit/", EditTheatreData.as_view(), name="theatre_edit"),
    path("theatre/<int:id>/delete/", DeleteTheatre.as_view(), name="theatre_delete"),
    path(
        "get-theatre-booking/",
        Get_Theatre_Bookings.as_view(),
        name="get-theatre-booking",
    ),
    path(
        "theatre-dashboard/<int:owner_id>/",
        DashboardStatus.as_view(),
        name="theatre-dashboard",
    ),
    path("theatre-revenue/", Revenue_Chart.as_view(), name="theatre-revenue"),
    path("theatre-profile/", EditTheatreProfile.as_view(), name="edit-theatre-profile"),
    path('theatre-location/<int:theatre_id>/',
         get_theatre_location, name='theatre_location'),
]
