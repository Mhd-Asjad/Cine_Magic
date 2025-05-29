from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status , permissions
from rest_framework.response import Response
from .models import *
from booking.models import *
# Create your views here.

class PostReview(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self , request , booking_id):
        print(request.user)
    
        try :
            booking = Booking.objects.get(user = request.user , id = booking_id)
        
        except Booking.DoesNotExist:
            return Response({'error' : 'booking is not found'},status=status.HTTP_404_NOT_FOUND)
        show_end = booking.show.end_time
        show_date = booking.show.show_date
        show_ends =  datetime.combine(show_date , show_end)
        show_ends = timezone.make_aware(show_ends)
        print(type(show_ends))
        if timezone.now() < show_ends :
            return Response({"error": "You can review this movie only after the show ends ."}, status=status.HTTP_400_BAD_REQUEST)

        
        try:
            data = request.data
            rating_value = data.get('rating')
            review = data.get('review' , '')
    
            if not (1 <= rating_value <= 5):
                return Response({"error": "Rating must be between 1 and 5 stars."}, status=status.HTTP_400_BAD_REQUEST)
            
            rating , created = Rating.objects.update_or_create(
                user = request.user,
                movie = booking.show.movie,
                defaults={
                "booking": booking,
                "rating": rating_value,
                "review": review,

                }
            )
            return Response({'message':'review submitted successfully'} , status=status.HTTP_200_OK)
        except Exception as e:
            print('error:' , str(e))
            return Response({'error': str(e)},status=status.HTTP_400_BAD_REQUEST)