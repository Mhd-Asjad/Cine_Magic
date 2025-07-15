from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status, permissions
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
from theatre_owner.tasks import send_response_mail

# This view allows users to post reviews for movies they have booked.
class PostReview(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, booking_id):
        try: 
            booking = Booking.objects.get(user=request.user, id=booking_id)
        except Booking.DoesNotExist:
            return Response(
                {"error": "booking is not found"}, status=status.HTTP_404_NOT_FOUND
            )
        try:
            data = request.data
            rating_value = data.get("rating")
            review = data.get("review", "")

            if rating_value is None or not (1 <= rating_value <= 5):
                return Response(
                    {"error": "Rating must be between 1 and 5 stars."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            rating, created = Rating.objects.update_or_create(
                user=request.user,
                movie=booking.show.movie,
                defaults={
                    "booking": booking,
                    "rating": rating_value,
                    "review": review,
                },
            )
            return Response(
                {"message": "review submitted successfully"}, status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.info("error:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# This view retrieves all reviews for a specific movie.
class MovieReviews(APIView):
    parser_classes = [permissions.AllowAny]

    def get(self, request, movie_id):
        try:
            reviews = Rating.objects.filter(movie_id=movie_id).order_by("-created_at")
        except Rating.DoesNotExist:
            return Response(
                {"error": "reviews not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = ReviewSerilizer(reviews, many=True)
        logger.error(f'error on review serializer {serializer.data}')
        return Response(serializer.data, status=status.HTTP_200_OK)

# list all FAQs
class ListFAQ(ListAPIView):
    pagination_class = None
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer

# match manual replies based on keywords in the user's message
def match_manual_reply(message):
    message = message.lower()

    if "cancel" in message and "ticket" in message:
        return "You can cancel your ticket from the 'My Bookings' section."

    elif "refund" in message:
        return "Refunds usually take 3-5 business days to reflect."
    elif "transaction" in message or "payment failed" in message:
        return "Raise a Form regarding Issue admin Will reach You"

    elif "reschedule" in message:
        return "it is not possible"

    elif "complaint" in message or "report" in message or "issue" in message:
        return "You can report a complaint Form by entering your ticket Complaint here."

    elif "support" in message or "help" in message or "contact" in message:
        return "you can submit a form with rasing issues"
    return None

# This view handles the chatbot functionality, allowing users to interact with a chatbot for support.
class ChatBotView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        def stream_event():
            data = request.data
            user_msg = data.get("messages", [])[-1].get("content")
            user = request.user
            ChatLog.objects.create(user=user, message=user_msg)
            booking_related = [
                "ticket",
                "cancel",
                "refund",
                "reschedule",
                "complaint",
                "report",
                "support",
                "help",
                "contact",
                "transaction",
                "payment",
                "failed",
            ]
            msg = user_msg.split()
            if len(msg) <= 2 and any(key in msg for key in booking_related):
                reply = match_manual_reply(user_msg)
                if reply:
                    ChatLog.objects.create(
                        user=user, is_bot=True, reply=reply, message=user_msg
                    )
                yield f"{reply}\n\n"
                time.sleep(1.05)
                return

            system_instruction = (
                "You are a helpful complaint support assistant for an online movie ticket booking platform. "
                "Respond politely and help the user based on complaints context in < 40 words"
            )

            try:
                genai.configure(api_key=settings.GEMINI_API_SECRET)
                model = genai.GenerativeModel("gemini-1.5-flash")
                prompt = f"{system_instruction}\n\nUser : {user_msg}"
                convo = model.start_chat()

                reply = convo.send_message(prompt).text

                yield f"{reply}\n\n"

            except Exception as e:
                logger.error("gemini error ", str(e))
                reply = "chatbot is currently unavailable"

            chatlog = ChatLog.objects.create(
                user=user, is_bot=True, reply=reply, message=user_msg
            )

            logger.info(reply, "assistant replyyy")

        return StreamingHttpResponse(stream_event(), content_type="text/plain")

# This view retrieves the chat history for the authenticated user.
class ChatHistoryView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:

            logs = ChatLog.objects.filter(user=request.user).order_by("created_at")
            if not logs.exists():
                return Response([], status=status.HTTP_200_OK)
            data = []

            for log in logs:
                for log in logs:
                    if not log.is_bot and log.message:
                        data.append(
                            {
                                "id": f"{log.id}",
                                "role": "user",
                                "content": log.message,
                                "timestamp": log.created_at,
                            }
                        )

                    if log.is_bot and log.reply:
                        data.append(
                            {
                                "id": f"{log.id}",
                                "role": "assistant",
                                "content": log.reply,
                                "timestamp": log.created_at,
                            }
                        )

                return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error fetching chat history: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)

# This view checks if the user has a chat log before raising a complaint.
class check_chatlog(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        try:
            user = request.user
            chatlog = ChatLog.objects.filter(user=user)
            if chatlog.exists():
                return Response(
                    {"message": "user tried chatbot"}, status=status.HTTP_200_OK
                )

            else:
                return Response(
                    {
                        "message": "would you please raise your complaint through chatbot first?"
                    }
                )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# raise a complaint form if the user has a chat log
class Raisecomplaint_form(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):

        data = request.data.copy()
        logger.info(data)
        user_id = data.get("user")
        chat = data.get("chat")
        if chat == "null" or any(char.isalpha() for char in chat):
            try:
                chat_instance = ChatLog.objects.filter(user_id=user_id).last()
                if chat_instance:
                    data["chat"] = chat_instance.id

            except Exception as e:
                return Response(
                    {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        serializer = ComplaintSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "complaint submitted successfully"},
                status=status.HTTP_201_CREATED,
            )
        else:
            logger.error(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# This view retrieves all complaints submitted by users.
class ShowComplaints(APIView):
    permission_classes = [permissions.IsAdminUser]
    def get(self, request):
        try:
            complaints = Complaints.objects.all().order_by("-created_at")
            serializer = ComplaintResponseSerializer(
                complaints, many=True, context={"request": request}
            )
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(str(e))
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# This view retrieves the details of a specific complaint.
class Complaint_details(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, complaint_id):
        try:
            complaint = Complaints.objects.get(id=complaint_id)

        except Complaints.DoesNotExist:
            return Response(
                {"message": "Complaint does not exist or is not resolved"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = ComplaintResponseSerializer(
            complaint, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

# This view allows the admin to respond to a complaint.
class ComplaintResponseView(APIView):
    permission_classes = [permissions.IsAdminUser]
    def patch(self, request, pk):
        print(request.data)
        try:
            complaint = Complaints.objects.get(pk=pk)
        except Complaints.DoesNotExist:
            return Response(
                {"error": "complaint does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = ComplaintResponseSerializer(
            instance=complaint,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        username = complaint.user.username
        user_email = complaint.user.email
        subject = f"Your Complaint (#{complaint.subject}) has been updated"

        if serializer.is_valid():
            serializer.save()

            message = (
                f"Hi {username},\n\n"
                f"Your complaint status is now {serializer.data['status']}.\n"
                f"Our Response : {serializer.data['response_message']}\n\n"
                f"Thank you for your patience.\n\nSupport Team"
            )

            send_response_mail.delay(user_email, subject, message)
            return Response(serializer.data, status=status.HTTP_200_OK)
        logger.error(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
