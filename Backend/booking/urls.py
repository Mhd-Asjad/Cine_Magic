from django.urls import path
from .views import *

urlpatterns = [
    path('checkout/<int:user_id>/' , Checkout.as_view() , name='checkout'),
    path('create-booking/',Create_Booking.as_view() , name='create-booking'),
    path('process-payment/', ProcessPayment.as_view(), name='process-payment'),
    path('verify/' , Verify_Booking.as_view() , name='verify'),
    path('booking-info/<int:id>/',Booking_Info.as_view(),name='booking-info'),
    path('my-bookings/<int:user_id>/',Show_Bookings.as_view() , name='my-bookings')
]