from rest_framework import serializers
from theatre_owner.models import TheaterOwnerProfile
from movies.models import *
from theatres.models import *

class TheatreOwnerSerialzers(serializers.ModelSerializer) :
    class Meta :
        model = TheaterOwnerProfile
        fields = ['user' , 'theatre_name' , 'location' , 'state' , 'pincode' , 'user_message']

    def create(self, validated_data) :
        
        Theatre_Owner =  TheaterOwnerProfile.objects.create(**validated_data)
        return Theatre_Owner



class FetchMovieSerializer(serializers.ModelSerializer) :
    
    poster = serializers.SerializerMethodField()
    class Meta :
        model = Movie
        fields = ['id','title' , 'language' , 'duration' , 'release_date' , 'description' , 'genre' , 'poster' ]
        
    def get_poster(self , obj):
        request = self.context.get('request')
        if obj.poster :
            return request.build_absolute_uri(obj.poster.url)
        return None
class TimeSlotSerializer(serializers.ModelSerializer) :
    class Meta :
        model = TimeSlot
        fields= ['id' , 'start_time']
        
class CreateScreenSerializer(serializers.ModelSerializer):
    theatre_name = serializers.CharField(source='theatre.name',read_only=True)
    time_slots = TimeSlotSerializer(many=True , write_only = True)
    class Meta :
        model = Screen
        fields = [ 'id' , 'theatre' , 'theatre_name', 'screen_number' , 'capacity' , 'screen_type' , 'layout' , 'time_slots']

    def create(self, validated_data):
        time_slot_data =  validated_data.pop('time_slots' , [])
        screen = Screen.objects.create(**validated_data)
        
        for time_slot in time_slot_data :
            TimeSlot.objects.create(screen=screen , **time_slot)
            
            
        return screen


class Createshowtimeserializers(serializers.ModelSerializer):
    movie_name = serializers.CharField(source='movie.title',read_only = True)
    screen_number = serializers.CharField(source='screen.screen_number')
    start_time = serializers.CharField(source='slot.start_time' , read_only=True)
    
    class Meta :
        model = ShowTime
        fields = ['id' ,'movie_name' ,'screen_number' ,'screen' ,'movie' ,'slot' ,'show_date' ,'start_time' ,'end_time']
        
    def create(self , validated_data):
        showtime = ShowTime.objects.create(**validated_data)
        return showtime
    
class UpdateTheatreOwnerSeriailizer(serializers.ModelSerializer):
    class Meta :
        model = TheaterOwnerProfile
        fields = ['id' , 'theatre_name' , 'location' , 'state' , 'pincode']