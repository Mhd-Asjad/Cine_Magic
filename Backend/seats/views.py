from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
import string
from django.utils import timezone
from django.db.models import Count
from booking.models import SeatLock
# import rest_framework.permissions import isAuth

class create_layout(APIView):
    def post(self, request  ) :
        data = request.data
        name = data['name']
        row = data['rows']
        col = data['cols']
        print(data)
        if not name or not row or not col :
            return Response({'error':'fill up the fields'} , status=status.HTTP_400_BAD_REQUEST)
        
        if SeatScreenLayout.objects.filter(name__icontains=data['name']).exists():
            return Response({'error' : f'layout {name} is already exists'},status=status.HTTP_400_BAD_REQUEST)
        
        if int(row) <=2 or int(col) <= 2 :
            return Response({'error':'enter a valid rows and seats format'}, status=status.HTTP_400_BAD_REQUEST) 
        
        
        serializers = CreateLayoutSerializers(data=request.data)
        if serializers.is_valid():
            data.pop('name')
        
            serializers.save()
            return Response(serializers.data , status=status.HTTP_201_CREATED)
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)    
    
class GetScreenLayout(APIView):
    def get(self , request) :
        layouts = SeatScreenLayout.objects.all()
        serializer = LayoutSerializers(layouts , many=True)   
        return Response(serializer.data , status=status.HTTP_200_OK )

    
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
        
class get_screen_seats(APIView):
    def get(self , request , screen_id):
        try :
            seatss = seats.objects.filter(screen = screen_id , is_active = True)
            print(seatss)
      
            
            seat_data = [
                {
                'id' : seat.id,
                'row' : seat.row,
                'number' : seat.number,
                'category_id' : seat.category.id,
                'category_name' : seat.category.name,
                'price' : seat.category.price
                }
                for seat in seatss
            ]
                
            return Response(seat_data , status=status.HTTP_200_OK)
        except Exception as e :
            return Response({'error' : str(e)} , status=status.HTTP_400_BAD_REQUEST)
        

class get_theatre_screens(APIView):
    def get(self , request , id) :
        try :
            theatres = Theatre.objects.filter(owner=id , is_confirmed = True)
            print(theatres,'new theatres')
            data = []
            for theatre in theatres :
                for screen in theatre.screens.all():
                    data.append({
                        'id' : screen.id,
                        'screen_number' : screen.screen_number,
                        'capacity' : screen.capacity ,
                        'theatre': {
                            'name' : theatre.name
                        }
                    })
                
            return Response({
                'screen_data' : data 
            },status=status.HTTP_200_OK)
            
        except Theatre.DoesNotExist:
            return Response({'message':'theatre not found'} , status=status.HTTP_404_NOT_FOUND)
        
class get_seats_category(APIView):
    def get(self , request):
        cat = SeatCategory.objects.all()
        serializer = All_SeatCategory(cat , many=True)
        return Response(serializer.data , status=status.HTTP_200_OK)
   
        
class update_seats_category(APIView):
    # permission_classes = [isAuthenticated]
    
    def post(self , request ):
        seats_ids = request.data.get('seats_ids',[])
        category_id = request.data.get('category_id')
        
        if not seats.objects.filter(id__in = seats_ids ).exists():
            return Response({'error' : 'no seats are selected'} , status=status.HTTP_400_BAD_REQUEST)
        
        
        seats.objects.filter(id__in = seats_ids).update(category_id=category_id)
        return Response({'message' : 'seats category updated successfully'})
    
    
    class Lock_seats(APIView):
        def post(self , request):
            data = request.data
            seats_ids = data.get('seats_id')
            show_id = data.get('show_id')
            session_id = request.session.session_key or request.session.save()
            
            expires_at = timezone.now() + timezone.timedelta(minutes=10)
            locked_seats = SeatLock.objects.filter(
                seat_id__in = seats_ids ,
                show_id = show_id,
                expires_at__gt=timezone.now()
                 
            )
            if locked_seats.exists():
                return Response({'error' : 'some seats are not available'} , status=status.HTTP_400_BAD_REQUEST)
                     
            for seat_id in seats_ids:
                SeatLock.objects.get_or_create(
                    seat_id = seat_id,
                    show_id = show_id , 
                    user = session_id,
                    defaults={
                        'expires_at' : expires_at
                    }
                )
                
            
            request.session['locked_seats'] = seats_ids
            request.session['show_id'] = show_id
            return Response({'message' : 'seats locked successfully'} , status=status.HTTP_200_OK)  