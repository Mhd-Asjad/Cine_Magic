from rest_framework import serializers
from .models import *
from theatres.models import Screen



class LayoutSerializers(serializers.ModelSerializer):
    total_capacity = serializers.SerializerMethodField()
    class Meta : 
        model = SeatScreenLayout
        fields = [ 'id' ,'name' , 'rows' , 'cols' , 'total_capacity' ]
        

    def get_total_capacity(self , obj) :
        return obj.total_capacity
    
class LayoutSerializer(serializers.ModelSerializer):
    class Meta :
        model = SeatScreenLayout
        fields = [ 'id' , 'name' , 'rows' , 'cols' ]
    
class Screens_seatsSerializers(serializers.ModelSerializer):
    layout = LayoutSerializer(read_only=True)
    class Meta :
        model = Screen
        fields  = [ 'id' , 'theatre' , 'screen_number' , 'capacity' , 'screen_type' , 'layout']