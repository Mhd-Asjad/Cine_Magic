from rest_framework import serializers
from useracc.models import User 
from movies.models import City , Movie
from theatres.models import Theatre



class Userserialzer(serializers.ModelSerializer):
    class Meta :
        model = User
        fileds = '__all__'


class CitySerializer(serializers.ModelSerializer) :
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
    

class TheatreSerializer(serializers.ModelSerializer) :
    class Meta :
        model = Theatre
        fields = ['id' , 'name' , 'city' , 'address']
    
class MovieSerializers(serializers.ModelSerializer) :
    cities = serializers.PrimaryKeyRelatedField(
        many=True , queryset=City.objects.all()
    )

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
            "cities",
        ]

    def create(self, validated_data ):

        cities = validated_data.pop('cities' , [])
        movie = Movie.objects.create(**validated_data)
        movie.cities.set(cities)
        return movie