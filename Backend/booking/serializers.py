from rest_framework import serializers
from .models import *

class BookingSerializer(serializers.ModelSerializer):
    show_date = serializers.CharField(source='show.show_date',read_only=True)
    show_time = serializers.CharField(source='slot.start_time',read_only=True)
    theatre_name = serializers.CharField(source='show.screen.theatre.name')
    class Meta :
        model = Booking
        fields = ['id' ,'booking_id' , 'show' , 'theatre_name' ,  'customer_name' , 'slot', 'show_date' , 'show_time' ,'customer_email' , 'status' , 'amount' , 'refund_amount' , 'refunt_status']
        
        
class TicketViewSerializer(serializers.ModelSerializer):
    show_name = serializers.CharField(source='show.movie.title')
    class Meta :
        
        model = Booking
        fields = [ 'booking_id' , 'status' , 'show' , 'show_name' , 'customer_email' , 'amount' , 'refund_amount','refunt_status']
