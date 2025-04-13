from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from .serializers import *
from rest_framework.response import Response

class create_layout(APIView):
    def post(self, request , screen_id ) :
        data = request.data
        
            
class GetScreenLayout(APIView):
    def get(self , request) :
        layouts = SeatScreenLayout.objects.all()
        serializer = LayoutSerializers(layouts , many=True)   
        return Response(serializer.data )
    
    
class get_theatre_screenlayout(APIView):
    def get(self , request , owner_id ):
        
        try :
            theatres = Theatre.objects.filter(owner=owner_id)
            
        except Theatre.DoesNotExist:
            return Response({'error' : 'theatre not found'} , status=400)
        data = []
        
        for theatre in theatres :
            screens = Screen.objects.filter(theatre=theatre) 
            
            serializers = Screens_seatsSerializers(screens,many=True)
            
            
            data.append({
                'theatre_id' : theatre.id,
                'theatre_name' : theatre.name,
                'screens' :serializers.data
            })    
        return Response(data, status=200)

        
        
        