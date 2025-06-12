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
from django.core.mail import send_mail

class PostReview(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self , request , booking_id):
        print(request.user)
        
        try :
            booking = Booking.objects.get(user = request.user , id = booking_id)
            print(booking)
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

    
            if rating_value is None or not (1 <= rating_value <= 5):
                return Response({"error": "Rating must be between 1 and 5 stars."}, status=status.HTTP_400_BAD_REQUEST)

            print(booking.show.movie , 'movie id on line :42')
            
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
    
    
def match_manual_reply(message):
    message = message.lower()

    if "cancel" in message and "ticket" in message :
        return "You can cancel your ticket from the 'My Bookings' section."

    elif "refund" in message:
        return "Refunds usually take 3-5 business days to reflect."
    elif 'transaction' in message or 'payment failed' in message :
        return "Raise a Form regarding Issue admin Will reach You"
    
    elif 'reschedule' in message:
        return 'it is not possible'

    elif "complaint" in message or "report" in message or 'issue' in message :
        return "You can report a complaint Form by entering your ticket Complaint here."

    elif "support" in message or 'help' in message or 'contact' in message:
        return "you can submit a form with rasing issues"
    return None


class ChatBotView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self , request ):
    
                
        def stream_event():
            data = request.data
            print(data , 'values from input')
            user_msg = data.get("messages", [])[-1].get("content")
            user = request.user
            print(user.id)
            print(user_msg)
            ChatLog.objects.create(user=user , message = user_msg)
            booking_related = [
                'ticket' , 
                'cancel' , 
                'refund' , 
                'reschedule' , 
                'complaint' , 
                'report' , 
                'support' , 
                'help' , 
                'contact',
                'transaction',
                'payment',
                'failed'
            ]
            msg = user_msg.split()
            if len(msg) <= 2 and any(key in msg for key in booking_related) :
                reply = match_manual_reply(user_msg)
                if reply :
                    ChatLog.objects.create(
                        user=user ,
                        is_bot=True, 
                        reply=reply , 
                        message = user_msg
                    )
                yield f"{reply}\n\n"
                time.sleep(1.05)
                return

            
            system_instruction = ("You are a helpful complaint support assistant for an online movie ticket booking platform. "
            "Respond politely and help the user based on complaints context in < 40 words")

            
            
            try :
                genai.configure(api_key=settings.GEMINI_API_SECRET)
                model = genai.GenerativeModel('gemini-1.5-flash')
                prompt = f'{system_instruction}\n\nUser : {user_msg}'
                convo = model.start_chat()
                
                reply = convo.send_message(prompt).text
                
                yield f'{reply}\n\n'
                
            except Exception as e :
                print('gemini error ' , str(e))
                reply = "chatbot is currently unavailable"

            chatlog = ChatLog.objects.create(
                user=user ,
                is_bot=True, 
                reply=reply , 
                message = user_msg
            )
            
            print(reply , 'assistant replyyy')

        return StreamingHttpResponse(
            stream_event(),content_type='text/plain'
        )
        
        
class ChatHistoryView(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self , request):
        try:
            
            logs = ChatLog.objects.filter(user = request.user ).order_by('created_at')
            if not logs.exists():
                return Response([],status=status.HTTP_200_OK)
            data = []
                
            for log in logs :
                for log in logs:
                    if not log.is_bot and log.message :
                        data.append({
                            'id': f"{log.id}",
                            'role': 'user',
                            'content': log.message,
                            'timestamp': log.created_at,
                        })
                    
                    if log.is_bot and log.reply: 
                        data.append({
                            'id': f"{log.id}",
                            'role': 'assistant', 
                            'content': log.reply,
                            'timestamp': log.created_at,
                        })
                        
                return Response(data, status=status.HTTP_200_OK)

        except Exception as e :
            print(f"Error fetching chat history: {str(e)}")
            return Response({'error' : str(e)},status=status.HTTP_404_NOT_FOUND)
        
        
class check_chatlog(APIView):
    def get(self , request):
        try:
            user = request.user
            chatlog = ChatLog.objects.filter(user=user)
            if chatlog.exists():
                return Response({'message':'user tried chatbot'},status=status.HTTP_200_OK)
            
            else :
                return Response({'message':'would you please raise your complaint through chatbot first?'})
        except Exception as e :
            return Response({'error':str(e)},status=status.HTTP_400_BAD_REQUEST)
        
        
class Raisecomplaint_form(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self , request):
        
        data = request.data.copy()
        print(data)
        user_id = data.get('user')
        chat = data.get('chat')
        if chat == 'null' or chat.isalpha() :
            try :
                chat_instance = ChatLog.objects.filter(user_id=user_id).last()
                if chat_instance :
                    data['chat'] = chat_instance.id
            
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
         

        serializer = ComplaintSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'complaint submitted successfully'} ,status=status.HTTP_201_CREATED )
        else :
            print(serializer.errors)
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
        
class ShowComplaints(APIView):
    def get(self , request):
        try:
            complaints = Complaints.objects.all().order_by('-created_at')
            serializer = ComplaintResponseSerializer(complaints , many=True ,context={'request' : request })
            return Response(serializer.data , status=status.HTTP_200_OK)
    
        except Exception as e:
            print(str(e))
            return Response({'error' : str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class Complaint_details(APIView):
    def get(self , request , complaint_id):
        try :            
            complaint = Complaints.objects.get(id = complaint_id)
            
        except Complaints.DoesNotExist :
            return Response({'message': 'Complaint does not exist or is not resolved'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ComplaintResponseSerializer(complaint ,  context={'request' : request})
        return Response(serializer.data , status=status.HTTP_200_OK)
    
class ComplaintResponseView(APIView):
    def patch(self , request , pk):
        
        try:
            complaint = Complaints.objects.get(pk=pk)
        except Complaints.DoesNotExist:
            return Response({'error': 'complaint does not exist'} , status=status.HTTP_404_NOT_FOUND)
        
        
        serializer = ComplaintResponseSerializer(instance = complaint , data = request.data , partial = True ,  context={'request' : request} )
        
        username = complaint.user.username
        user_email = complaint.user.email
        subject = f"Your Complaint (#{complaint.subject}) has been updated"

        if serializer.is_valid():
            serializer.save()
            
            message = f"Hi {username},\n\n" \
                f"Your complaint status is now {serializer.data['status']}.\n" \
                f"Our Response : {serializer.data['response_message']}\n\n" \
                f"Thank you for your patience.\n\nSupport Team"
                
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user_email],
                fail_silently=False
            )
            return Response(serializer.data , status=status.HTTP_200_OK)
        print(serializer.errors)
        return Response(serializer.errors , status=status.HTTP_400_BAD_REQUEST)
        