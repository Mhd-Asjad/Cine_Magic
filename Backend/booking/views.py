from rest_framework.views import APIView
from rest_framework.decorators import api_view
from .models import *
from seats.models import *
from .serializers import *
from useracc.models import User
from rest_framework.response import Response
from rest_framework import status , permissions
from django.utils import timezone
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import requests
from django.db import transaction
from .serializers import *
from rest_framework import permissions
from theatre_owner.serializers import FetchMovieSerializer
from django.shortcuts import get_object_or_404
from movies.models import Movie
import paypalrestsdk
from useracc.permissions import IsAuthenticatedUser
import logging
paypalrestsdk.configure({
    'mode' : 'sandbox',
    'client_id' : settings.PAYPAL_CLIENT_ID,
    'client_secret' : settings.PAYPAL_CLIENT_SECRET,
})  

logger = logging.getLogger(__name__)

# provides checkout details
class Checkout(APIView) :
    permission_classes = [IsAuthenticatedUser]
    def get(self , request , user_id):
        print(request.user)

        try :
            user = User.objects.get(id=user_id)
            seats_ids = request.query_params.getlist('selectedseats')
            show_id = request.query_params.get('show_id')
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
    permission_classes = [IsAuthenticatedUser]
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

# booking creating view
class Create_Booking(APIView):
    permission_classes = [permissions.IsAuthenticated]
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
            print(type(data)) 
            try:
                purchase_units  = paymentdet.get('purchase_units' , [])
                if purchase_units :
                    captures = purchase_units[0].get('payments' , {}).get('captures' , [])
                    if captures :
                        capture_id = captures[0].get('id')
                        print(capture_id , 'capture id')
                    else :
                        print('No Capture found')
                else :
                    print('No purchase unit found')
                    capture_id = None
            except Exception as e:
                print('Error in purchase unit' , str(e))
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
                    capture_id = capture_id,
                    payment_method = 'paypal',

                )
            return Response({'message': 'Booking created successfully' , 'booking_id' : booking.id }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print('error in booking' , str(e))
            return Response({'error' : str(e)},status=status.HTTP_400_BAD_REQUEST)
        
# verifying the booking done by the user
class Verify_Booking(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self , request ) :
        
        show_id = request.GET.get('show_id')
        selected_seat_ids = request.GET.getlist('selected_seats[]') 
        
        booking_exists = BookingSeat.objects.filter(booking__show_id=show_id , seat_id__in=selected_seat_ids, booking__status = 'confirmed' ).exists()
        
        if booking_exists :
            return Response({'success' : True , 'booking' : True },status=status.HTTP_200_OK)

        return Response({'success':False},status=status.HTTP_200_OK)

class Booking_Info(APIView):
    
    permission_classes = [permissions.IsAuthenticated]
    def get(self , request, id) :
        if not id :
            return Response({'error' : 'booking id not '},status=status.HTTP_400_BAD_REQUEST)
        
        booking = Booking.objects.get(id = id)
        serializer = BookingSerializer(booking)
        return Response(serializer.data , status=status.HTTP_200_OK)    

# whole booking details view for the user    
@method_decorator(csrf_exempt , name='dispatch')
class Show_Bookings(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self , request , user_id ):
        try :
            
            user = User.objects.get(id=user_id)
            
            bookings = Booking.objects.filter(user=user).order_by('-booking_time')
            
            data = []
            for booking in bookings :
                seats = [ bs.seat.row + str(bs.seat.number) for bs in booking.bookingseats.all()]
                data.append({
                    'id' : booking.id,
                    'booking_id' : booking.booking_id,
                    'show': {
                    'movie' : booking.show.movie.title,
                    'show_date' : booking.show.show_date.strftime('%Y-%m-%d'),
                    # 'start_time' : booking.show.slot.start_time.strftime("%H:%M"),
                        
                    },                    
                    'seats' : seats ,
                    'status' : booking.status,
                    'amount' : float(booking.amount),
                    'booking_time': booking.booking_time.strftime('%Y-%m-%d %H:%M'),

                    
                })
                
            return Response({'bookings':data},status=status.HTTP_200_OK)
        
        except Exception as e :
            return Response({'error':str(e)},status=status.HTTP_400_BAD_REQUEST)

# ticket detailed view for the booking id
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
        
    slot_det = booking.show.old_slot.all()
    print(slot_det , 'slot details')
    logger.info('slot details' , slot_det)

    data = {
        'id' : booking.id,
        'booking_id' : booking.booking_id,
        'email' : booking.customer_email,
        # 'show_time' : booking.show.slot.start_time.strftime(' %H:%M'),
        'booking_time' : booking.booking_time.strftime('%Y:%m:%d %H:%M'),   
        'qrcode_img' : request.build_absolute_uri(booking.qr_code.url) if booking.qr_code else None,
        'screen_number' : booking.show.screen.screen_number,
        'theatre' : booking.show.screen.theatre.name , 
        'screen_type' : booking.show.screen.screen_type,
        'screen_number' : booking.show.screen.screen_number,
        'refund_status' : booking.refunt_status,
    }

    return Response({'ticket_data' : data , 'movie_details' : show.data , 'seats' : seat_det['seats'] },status=status.HTTP_200_OK)

# refund claculation view
class Calculate_Refund_amount(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self , request , booking_id ):
        try:
            booking = Booking.objects.get(id=booking_id)
            
        except Booking.DoesNotExist :
            return Response({'error':'booking not found'},status=status.HTTP_404_NOT_FOUND)
        
        total = booking.amount
        booking_id = booking.booking_id
        show_date = booking.show.show_date
        show_time =  booking.show.slot.start_time 
        
        show_date_time = datetime.combine(show_date , show_time)
        show_date_time = timezone.make_aware(show_date_time)

        now = timezone.now()
        time_diff = show_date_time - now
        hours_diff = time_diff.total_seconds() // 3600
        
        print(hours_diff , 'hours diff')
        if hours_diff > 24 :
            refund_percentage = 98
        elif 12 <= hours_diff <= 24 :
            refund_percentage = 75
        elif 2 <= hours_diff < 12 :
            refund_percentage = 50
        else : 
            refund_percentage = 0
            

        refund_amount = (booking.amount * refund_percentage) / 100
        print(refund_percentage , 'refund amount')
        refund_data= {
            'id' : booking.id ,
            'booking_id' : booking_id ,
            'amount' : total ,
            'refund_amount' : refund_amount,
            'refund_percentage' : refund_percentage ,
            'hour_diff' : hours_diff 
        }                 
        return Response({'refund_data':refund_data} , status=status.HTTP_200_OK)
    
    
# ticket cancellation view
class Cancel_Ticket(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self , request , booking_id) :
        data = request.data
        print(booking_id ,'jjkdsd')
        re_amount = data.get('refund_amount')
        print( re_amount ,'amount')
        
        try:
            booking = Booking.objects.get(id=booking_id)
            
        except Booking.DoesNotExist:
            return Response({'error':'booking not found'},status=status.HTTP_404_NOT_FOUND)
        
        if booking.status == 'cancelled':
            return Response({'error' : 'ticket was already cancelled'} , status=status.HTTP_400_BAD_REQUEST)
        
        booking.cancelled_at = timezone.now()
        booking.status = 'cancelled'
        booking.refund_amount = re_amount
        booking.refunt_status = 'pending'
        booking.save()
        
        try :
            bookingseats = BookingSeat.objects.filter(booking=booking_id)
        except BookingSeat.DoesNotExist:
            return Response({'error': 'bs not found'},status=status.HTTP_404_NOT_FOUND )
        
        for bs in bookingseats:
            bs.status = 'cancelled'
            bs.save()
        return Response({'message' : 'You cancellation has been processed update you in email✅'},status=status.HTTP_200_OK)
    
class process_refund(APIView) :
    permission_classes = [permissions.AllowAny]
    def post(self , request , booking_id):
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({'error':'booking not found'},status=status.HTTP_404_NOT_FOUND)
        
        if booking.refunt_status == 'completed':
            return Response({'error' : 'refund already processed'} , status=status.HTTP_400_BAD_REQUEST)
        try:
            
            
            payment = booking.payment
        
            sale = paypalrestsdk.Sale.find(payment.capture_id)
            refund = sale.refund({
                "amount": {
                    "currency": "USD",
                    "total": str(booking.refund_amount)
                }
            })

            if refund.success() :
                booking.refunt_status = 'completed'
                booking.save()
                return Response({'message' : 'refund processed successfully'} , status=status.HTTP_200_OK)
            
            else:
                booking.refunt_status = 'not_applicable'
                booking.save()
                return Response({'error' : 'refund failed'} , status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            booking.refunt_status = 'failed'
            booking.save()
            print('error in refund' , str(e))
            return Response({'error' : 'refund failed'} , status=status.HTTP_400_BAD_REQUEST)
        
# booking status view
class Get_Booking_Status(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self , request , booking_id):
        try:
            booking = Booking.objects.get(id=booking_id)
        except Booking.DoesNotExist:
            return Response({'error':'booking not found'},status=status.HTTP_404_NOT_FOUND)
        status_data = {
            'status' : booking.status,
            'refund_status' : booking.refunt_status,
            'booking_time' : booking.booking_time.strftime('%Y-%m-%d %H:%M'),
            'cancelled_at' : booking.cancelled_at.strftime('%Y-%m-%d %H:%M') if booking.cancelled_at else None,
            'refund_amount' : booking.refund_amount
        }
        return Response({'status' : status_data} , status=status.HTTP_200_OK)
    

class ticket_view(APIView): 
    permission_classes = [permissions.AllowAny]
    def get(self , request , id) :
        try :
            booking = Booking.objects.get(id=id)
            
            if booking.status == 'cancelled':
                return Response({'error' : 'link is invalid'},status=status.HTTP_400_BAD_REQUEST)
            
            serializer = TicketViewSerializer(booking)
            print(serializer.data)
            return Response(serializer.data , status=status.HTTP_200_OK)
        except Exception as e :
            return Response({'error' : str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)