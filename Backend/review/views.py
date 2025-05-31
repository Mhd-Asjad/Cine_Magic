from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status , permissions
from rest_framework.response import Response
from .models import *
from booking.models import *
from django.conf import settings
import json
from .serializers import *
from django.views.decorators.csrf import csrf_exempt
from rest_framework.generics import ListAPIView
import google.generativeai as genai
from django.http import StreamingHttpResponse
import time

class PostReview(APIView):
    permission_classes = [permissions.IsAuthenticated]
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
        
class MovieReviews(APIView):
    def get(self , request , movie_id):
        try :    
            reviews = Rating.objects.filter(movie_id=movie_id).order_by('-created_at')
        except Rating.DoesNotExist:
            return Response({'error' : 'reviews not found'},status=status.HTTP_404_NOT_FOUND)
        
        serializer = ReviewSerilizer(reviews , many=True)
        print(serializer.data)
        return Response(serializer.data ,status=status.HTTP_200_OK)
        
class ListFAQ(ListAPIView):
    pagination_class = None
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer

class ChatBotView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self , request ):
        def stream_event():
                
            data = request.data
            print(data , 'values from input')
            user_msg = data.get("messages", [])[-1].get("content")
            user = request.user
            
            print(user_msg)
            booking_related = ['ticket' , 'details']
            
            if any(key in user_msg.split() for key in booking_related ):
                return Response({
                    "id": 123,
                    "choices": [{
                        "message": {
                            "role": "assistant",
                            "content": "Please enter your booking ID here."
                        }
                    }]
                }, status=status.HTTP_200_OK)
            
            
            
            system_instruction = ("You are a helpful complaint support assistant for an online movie ticket booking platform. "
                                "Respond politely and help the user based on complaints context.")

            
            try :
                genai.configure(api_key=settings.GEMINI_API_SECRET)
                model = genai.GenerativeModel('gemini-1.5-flash')
                prompt = f'{system_instruction}\n\nUser : {user_msg}'
                convo = model.start_chat()
                
                reply = convo.send_message(user_msg).text
                
                yield f'{reply}\n\n'
                # time.sleep(0.05)
                # response = model.generate_content(prompt)
                # reply = response.text
        
                
            except Exception as e :
                print('gemini error ' , str(e))
                reply = "chatbot is currently unavailable"
                
            chatlog = ChatLog.objects.create(
                user=user , 
                is_bot=True , 
                reply=reply , 
                message = user_msg
            )
            print(reply , 'assistant replyyy')

        return StreamingHttpResponse(
            stream_event(),content_type='text/plain'
        )
