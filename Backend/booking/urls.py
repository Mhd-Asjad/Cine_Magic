from django.urls import path
from .views import *

urlpatterns = [
    path("checkout/", Checkout.as_view(), name="checkout"),
    path("create-booking/", Create_Booking.as_view(), name="create-booking"),
    path("process-payment/", ProcessPayment.as_view(), name="process-payment"),
    path("verify/", Verify_Booking.as_view(), name="verify"),
    path("booking-info/<int:id>/", Booking_Info.as_view(), name="booking-info"),
    path("my-bookings/<int:user_id>/", Show_Bookings.as_view(), name="my-bookings"),
    path("ticket/<int:booking_id>/", Ticket_View, name="ticket"),
    path("validate-ticket/<int:id>/", ticket_view.as_view(), name="validate-ticket"),
    path(
        "refund-info/<int:booking_id>/",
        Calculate_Refund_amount.as_view(),
        name="refund-info",
    ),
    path(
        "cancel-ticket/<int:booking_id>/", Cancel_Ticket.as_view(), name="cancel-ticket"
    ),
    path(
        "process-refund/<int:booking_id>/",
        process_refund.as_view(),
        name="process-refund",
    ),
    path(
        "booking-status/<int:booking_id>/",
        Get_Booking_Status.as_view(),
        name="booking-status",
    ),
    path("notifications/", list_notification.as_view(), name="notifications"),
    path(
        "notification-actions/<int:notification_id>/",
        notification_actions.as_view(),
        name="notification-actions",
    ),
    path("markall-asread/", mark_all_asread.as_view(), name="mark-all-asread"),
]
