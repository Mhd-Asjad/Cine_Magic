from rest_framework import serializers
from .models import *

class BookingSerializer(serializers.ModelSerializer):
    show_date = serializers.CharField(source='show.show_date',read_only=True)
    show_time = serializers.CharField(source='show.slot.start_time',read_only=True)
    class Meta :
        model = Booking
        fields = ['id' ,'booking_id' , 'show' , 'customer_name' , 'show_date' , 'show_time' ,'customer_email' , 'status' , 'amount']