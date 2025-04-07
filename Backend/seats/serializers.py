from rest_framework import serializers
from .models import *


class LayoutSerializers(serializers.ModelSerializer):
    total_capacity = serializers.SerializerMethodField()
    class Meta : 
        model = SeatScreenLayout
        fields = [ 'id' ,'name' , 'rows' , 'cols' , 'total_capacity' ]
        

    def get_total_capacity(self , obj) :
        return obj.total_capacity