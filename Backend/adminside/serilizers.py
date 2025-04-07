from rest_framework import serializers
from useracc.models import User 
from movies.models import City , Movie
from theatres.models import *
from theatre_owner.models import *
from useracc.models import User
class Userserialzer(serializers.ModelSerializer):
    class Meta :
        model = User
        fileds = '__all__'


class CitySerializers(serializers.ModelSerializer) :
    class Meta :
        model = City
        fields = ['name' , 'state' , 'pincode']


    def validate_pincode(self , data) :
        if len(data) != 6 : 
            raise serializers.ValidationError('pincode must be a valid format')
        
        return data
    
    def create(self, validated_data):
        print(validated_data)
        city = City.objects.create(**validated_data)
        print(f'created Cities are : {city.name} - {city.state}')
        return city
    
class CitySerializer(serializers.ModelSerializer) :
    class Meta :
        model = City
        fields = ['name' , 'state' , 'pincode']
        
        
class TheatreOwnerSerialzers(serializers.ModelSerializer) :
    user_name = serializers.CharField(source='user.username')
    class Meta :
        model = TheaterOwnerProfile
        fields = ['id' , 'user_name' , 'theatre_name' , 'location' , 'state' , 'pincode' , 'ownership_status']
        
        
class ShowTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShowTime
        fields = [ 'movie', 'start_time', 'end_time']

class ScreenSerializer(serializers.ModelSerializer):
    showtimes = ShowTimeSerializer(many=True)

    class Meta:
        model = Screen
        fields = ['id','screen_number', 'capacity', 'screen_type', 'showtimes']
        
class TheatreSerializer(serializers.ModelSerializer) :
    owner = TheatreOwnerSerialzers(read_only=True)
    screens = ScreenSerializer(many=True)
    city = CitySerializer(read_only=True)
    class Meta :
        model = Theatre
        fields = ['id' , 'name' , 'city', 'address' , 'is_confirmed', 'has_screen' , 'owner' , 'screens']
    
class MovieSerializers(serializers.ModelSerializer) :

    class Meta :
        model = Movie
        fields = [
            "id",
            "title",
            "language",
            "duration",
            "release_date",
            "description",
            "genre",
            "poster",
        ]
        
    def create(self, validated_data ):
        movie = Movie.objects.create(**validated_data)
        return movie
    
