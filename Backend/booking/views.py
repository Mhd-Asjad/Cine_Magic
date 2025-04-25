from rest_framework.views import APIView
from .models import *
from seats.models import *
from .serializers import *
from useracc.models import User
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import requests
from django.db import transaction
from .serializers import *

class Checkout(APIView) :
    def get(self , request , user_id):
        try :
            user = User.objects.get(id=user_id)
            print(user.username)
            seats_ids = request.query_params.getlist('selectedseats')
            print(seats_ids)
            show_id = request.query_params.get('show_id')
            print(show_id)
            session_id = request.session.session_key

            if not seats_ids or not show_id:
                return Response({'seat_error' : 'no seats are locked'} , status=status.HTTP_400_BAD_REQUEST)
            
            expired = SeatLock.objects.filter(
                seat_id__in=seats_ids,
                show_id=show_id,
                user = session_id,
                expires_at__lt=timezone.now()
            )
            if expired.exists():
                return Response({'seat_error': 'some seats are not available'} , status=status.HTTP_400_BAD_REQUEST)
            
            
            seatss = seats.objects.filter(id__in=seats_ids)
            category = seatss.values_list('category__name' , flat=True).first()
            seats_data = [ seat.row + str(seat.number) for seat in seatss ]
            
            show = ShowTime.objects.get(id=show_id)
            amount = sum( seat.category.price for seat in seatss)
            theatre =  show.screen.theatre
            
            return Response({
                'show_det' : {
                    'id' : show.movie.id,
                    'name' :show.movie.title,
                    'duration' : show.movie.duration ,
                    'language' : show.movie.language ,
                    'genre' : show.movie.genre ,
                    'poster' : request.build_absolute_uri(show.movie.poster.url) if show.movie.poster else None            
                },
                'show_time' : {
                    'date' : show.show_date,
                    'time' : show.slot.start_time 
                },
                'theatre':{
                    'name' : theatre.name ,
                    'location' :theatre.address ,
                },
                'screen' : {
                    'screen_type' : show.screen.screen_type,
                    'screen_number' : show.screen.screen_number
                },
                'seat_data' : seats_data ,
                'total_amount': amount ,
                'category' : category
                
            },status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'error' : str(e)}, status=status.HTTP_400_BAD_REQUEST)
# payment callback handling 
@method_decorator(csrf_exempt , name='dispatch')
class ProcessPayment(APIView):
    def post(self , request):
        order_id = request.data.get('orderId')
        print(order_id,'orderidddd')
        validation_url = f'{settings.PAYPAL_API_URL}/v2/checkout/orders/{order_id}'
        auth = (settings.PAYPAL_CLIENT_ID , settings.PAYPAL_CLIENT_SECRET)
        
        response = requests.get(validation_url , auth=auth)
        print(response)
        if response.status_code == 200 :
            payment_data = response.json()
            print(payment_data)
            
            return Response({'message' : 'payment compleated successfully'  ,  },status=status.HTTP_200_OK)
        
        else :
            return Response({'error' , 'payment validation fails'} , status=status.HTTP_400_BAD_REQUEST)
        
class Create_Booking(APIView):
    def post(self , request ):
        print('enters to the booking view')
        try:
            data = request.data
            user = User.objects.get(id=data['user_id'])
            show_id =  data['show_id']
            seat_ids = data['selected_seats']
            total_amount = data['total_amount']
            paymentdet = data['payment_details']    
            price = total_amount // len(seat_ids)
            
            with transaction.atomic():
                show = ShowTime.objects.get(id=show_id)
                print(show)
                booking = Booking.objects.create(
                    user=user ,
                    show = show,
                    customer_name = user.username,
                    customer_email = user.email ,
                    status = 'confirmed',
                    payment_id = paymentdet['id'],
                    amount = total_amount
                    
                )
                for seat_id in seat_ids:
                    seat = seats.objects.get(id=seat_id)
                    BookingSeat.objects.create(
                        booking=booking,
                        seat=seat,
                        price = price
                    )
                    
                Payment.objects.create(
                    booking = booking,
                    order_id = booking.booking_id,
                    payer_id = paymentdet['id'],
                    amount = total_amount,

                )
            return Response({'message': 'Booking created successfully' , 'booking_id' : booking.id }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error' : str(e)},status=status.HTTP_400_BAD_REQUEST)

class Verify_Booking(APIView):
    def get(self , request ) :
        show_id = request.GET.get('show_id')
        selected_seat_ids = request.GET.get('selected_seats') 
        print(selected_seat_ids)
        booking_exists = BookingSeat.objects.filter(booking__show_id=show_id , seat_id__in=selected_seat_ids, booking__status = 'confirmed' ).exists()
        
        if booking_exists :
            print('hhii')
            # booked_seats_ids = BookingSeat.objects.filter(booking=booking_exists).values_list('seat_id',flat=True)
            # if set(selected_seat_ids).issubset(booked_seats_ids):
            return Response({'success' : True , 'booking' : True },status=status.HTTP_200_OK)

        return Response({'success':False},status=status.HTTP_200_OK)

class Booking_Info(APIView):
    def get(self , request, id) :
        if not id :
            return Response({'error' : 'booking id not provided'},status=status.HTTP_400_BAD_REQUEST)
        
        booking = Booking.objects.get(id = id)
        serializer = BookingSerializer(booking)
        return Response(serializer.data , status=status.HTTP_200_OK)    
            
# @csrf_exempt
class Show_Bookings(APIView):
    def get(self , request , user_id ):
        try :
            
            user = User.objects.get(id=user_id)
            
            bookings = Booking.objects.filter(user=user).order_by('-booking_time')
            
            data = []
            for booking in bookings :
                seats = [ bs.seat.row + str(bs.seat.number) for bs in booking.bookingseats.all()]
                data.append({
                    'booking_id' : booking.booking_id,
                    'show': {
                    'movie' : booking.show.movie.title,
                    'show_date' : booking.show.show_date.strftime('%Y-%m-%d'),
                    'start_time' : booking.show.slot.start_time.strftime("%H:%M"),
                        
                    },                    
                    'seats' : seats ,
                    'status' : booking.status,
                    'amount' : float(booking.amount),
                    'booking_time': booking.booking_time.strftime('%Y-%m-%d %H:%M'),

                    
                })
                
            return Response({'bookings':data},status=status.HTTP_200_OK)
        
        except Exception as e :
            return Response({'error':str(e)},status=status.HTTP_400_BAD_REQUEST)