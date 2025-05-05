from rest_framework.views import APIView
from rest_framework.decorators import api_view
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

from theatre_owner.serializers import FetchMovieSerializer
from django.shortcuts import get_object_or_404
from movies.models import Movie

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
                booking = Booking.objects.create(
                    user=user ,
                    show = show,
                    customer_name = user.username,
                    customer_email = user.email ,
                    status = 'confirmed',
                    payment_id = paymentdet['id'],
                    amount = total_amount
                )
                booking.generate_qrcode()
                booking.save()
                for seat_id in seat_ids:    
                    seat = seats.objects.get(id=seat_id)
                    BookingSeat.objects.create(
                        booking=booking,
                        seat=seat,
                        price = price
                    )
                    try : 
                        seat_lock = SeatLock.objects.filter(seat = seat).delete()
                        print(seat_lock, 'seat lock')
                    except SeatLock.DoesNotExist:
                        pass
                    

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
        print(show_id)
        selected_seat_ids = request.GET.getlist('selected_seats[]') 
        print(selected_seat_ids)
        booking_exists = BookingSeat.objects.filter(booking__show_id=show_id , seat_id__in=selected_seat_ids, booking__status = 'confirmed' ).exists()
        
        if booking_exists :
            return Response({'success' : True , 'booking' : True },status=status.HTTP_200_OK)

        return Response({'success':False},status=status.HTTP_200_OK)

class Booking_Info(APIView):
    def get(self , request, id) :
        if not id :
            return Response({'error' : 'booking id not provided'},status=status.HTTP_400_BAD_REQUEST)
        
        booking = Booking.objects.get(id = id)
        serializer = BookingSerializer(booking)
        return Response(serializer.data , status=status.HTTP_200_OK)    
            
@method_decorator(csrf_exempt , name='dispatch')
class Show_Bookings(APIView):
    def get(self , request , user_id ):
        try :
            
            user = User.objects.get(id=user_id)
            
            bookings = Booking.objects.filter(user=user , status='confirmed').order_by('-booking_time')
            
            data = []
            for booking in bookings :
                seats = [ bs.seat.row + str(bs.seat.number) for bs in booking.bookingseats.all()]
                data.append({
                    'id' : booking.id,
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
    
@api_view(['GET'])
def Ticket_View( request , booking_id ):
    print('entered into the view')
    try :
        booking = Booking.objects.get(id=booking_id)
    
    except Booking.DoesNotExist :
        return Response({'error':'booking not found'},status=status.HTTP_404_NOT_FOUND)
    
    show_det = Movie.objects.get(id=booking.show.movie_id)
    show = FetchMovieSerializer(show_det, context={'request' : request})
    print(show.data)
    booking_seats = BookingSeat.objects.filter(booking=booking)
    seat_det = {}
    for seat in booking_seats :
        if 'seats' not in seat_det :
            seat_det['seats'] = []
            
        seat_det['seats'].append(f'{seat.seat.row}{seat.seat.number}')
        
    print(type(seat_det))
    
    data = {
        'id' : booking.id,
        'booking_id' : booking.booking_id,
        'email' : booking.customer_email,
        'show_time' : booking.show.slot.start_time.strftime(' %H:%M'),
        'booking_time' : booking.booking_time.strftime('%Y:%m:%d %H:%M'),   
        'qrcode_img' : request.build_absolute_uri(booking.qr_code.url) if booking.qr_code else None,
        'screen_number' : booking.show.screen.screen_number,
        'theatre' : booking.show.screen.theatre.name , 
        'screen_type' : booking.show.screen.screen_type,
        'screen_number' : booking.show.screen.screen_number,
        
        

    }

    return Response({'ticket_data' : data , 'movie_details' : show.data , 'seats' : seat_det['seats'] },status=status.HTTP_200_OK)
        