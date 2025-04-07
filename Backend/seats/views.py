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


    