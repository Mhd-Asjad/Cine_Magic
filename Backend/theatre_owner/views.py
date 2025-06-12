from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status , permissions
from django.contrib.auth import authenticate
from .models import TheaterOwnerProfile
from .serializers import TheatreOwnerSerialzers , FetchMovieSerializer , CreateScreenSerializer , Createshowtimeserializers , TimeSlotSerializer , UpdateTheatreOwnerSeriailizer , FetchShowTimeSerializer
from rest_framework.permissions import IsAuthenticated , AllowAny
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken
from movies.models import *
from theatres.models import Theatre , Screen , ShowTime , TimeSlot , ShowSlot
from useracc.models import User
from django.http import JsonResponse
from django.db import IntegrityError
from datetime import datetime , timedelta ,date
from django.utils import timezone
from django.utils.timezone import now
from django.db.models import Count
from seats.models import *
from booking.models import Booking , BookingSeat
from django.db.models import Sum , Count , Subquery , OuterRef
import logging

logger = logging.getLogger(__name__)

# Create your views here.
class CreateOwnershipProfile(APIView) :
    permission_classes = [AllowAny]
    def post(self , request ) :
        try:
            data = request.data
            user_id = data['user']
            print(data)
            user =  User.objects.get(id = user_id)
            if user.is_staff :
                return Response({'error' : 'admin cant register as a theatre owner'},status=status.HTTP_400_BAD_REQUEST)
            if TheaterOwnerProfile.objects.filter(user=user.id ,theatres__is_confirmed=False).exists():
                return Response({'error' : 'you have already registered for ownership verify it for another one'},status=status.HTTP_400_BAD_REQUEST)

            serializer = TheatreOwnerSerialzers(data = data)    
            if serializer.is_valid():
                user.is_theatre_owner = True
                user.save()
                serializer.save()
                
                return Response({'message' : 'request has been made soon update via mail'},status=status.HTTP_200_OK)
            print(serializer.errors)
            return Response(serializer.errors , status=status.HTTP_400_BAD_REQUEST)
        except Exception as e :
            print(str(e))
            return Response({'error' : str(e)} , status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class Update_theatreowner(APIView):
    def put(self , request , pk):
        print('inputdata' , request.data)
        theatre_name = request.data.get('theatre_name')
        try :
            owner = TheaterOwnerProfile.objects.get(pk=pk)
        except TheaterOwnerProfile.DoesNotExist:
            return Response({'error':'owner not found'},status=status.HTTP_404_NOT_FOUND)
        
        serializer = UpdateTheatreOwnerSeriailizer(instance=owner , data=request.data , partial=True)
        if serializer.is_valid():
            serializer.save()
            print(serializer.data)
            return Response(serializer.data , status=status.HTTP_200_OK) 
        
        print(serializer.errors)
        return Response(serializer.errors , status=status.HTTP_400_BAD_REQUEST)
    
class ConfirmTheatreOwner(APIView) :
    # getting unverified theatre enquries 
    def get(self , request ) :
        try :
            unverified_theatre = TheaterOwnerProfile.objects.filter(ownership_status = 'pending' , user__is_theatre_owner = True)
            print(unverified_theatre)
            data = []
            for theatre in unverified_theatre :
                enqueiry_data = {
                    'id' : theatre.id ,
                    'user_id' : theatre.user.id,
                    'owner_photo' : request.build_absolute_uri(theatre.owner_photo.url) if  theatre.owner_photo else None,
                    "theatre_name" : theatre.theatre_name , 
                    "location" : theatre.location , 
                    "state"  : theatre.state ,
                    "pincode" : theatre.pincode ,
                    "message" : theatre.user_message,
                    "ownership_status" : theatre.ownership_status
                }
            
                data.append(enqueiry_data)

            return Response({"enquery" : data , 'message' : 'data fetches succsessfully '},status=status.HTTP_200_OK)
        
        except TheaterOwnerProfile.DoesNotExist:
            return Response({'message' : 'no enquest'} , status=status.HTTP_400_BAD_REQUEST)

    # confirming the valid theatres enquiries
    def post(self , request  ) : 
        profile_id = request.data.get('id')
        ownership_status = request.data.get('ownership_status')
        user_id = request.data.get('userId')
        logger.info(f'ownership {ownership_status}')

        if not profile_id and ownership_status :
            return Response(
                {'error': 'Both id and ownership_status are required!'}
                ,status=status.HTTP_400_BAD_REQUEST
                
            )

        try :
            
            theatre_owner = TheaterOwnerProfile.objects.get(id=profile_id)
            user = User.objects.get(id=user_id)
            logger.error(f'handling user : {user}')

            
            if theatre_owner and ownership_status == 'confirmed':
                theatre_owner.ownership_status = ownership_status
                user.is_approved = True
                user.is_theatre_owner = True
                theatre_owner.save()
                user.save()

            if ownership_status == 'confirmed':
                try :
                    city, created = City.objects.get_or_create(

                        name = theatre_owner.location ,
                        state = theatre_owner.state ,
                        pincode = theatre_owner.pincode ,
                    )
                except IntegrityError:
                    city = City.objects.get(name = theatre_owner.location) 
                
                print(city)
                
                city.save()
                

                Theatre.objects.get_or_create(
                    owner=theatre_owner,
                    name=theatre_owner.theatre_name,
                    latitude = theatre_owner.latitude,
                    longitude = theatre_owner.longitude,
                    city=city,
                    address=f"{theatre_owner.location}, {theatre_owner.state}"
                )

                user = theatre_owner.user
                email_subject = 'Theatre Registration successfull'
                email_message = f'''
                    Dear {user.username}


                     Your theatre registration has been confirmed! 🎉

                    You can now log in using the following credentials:

                    Username: {user.username}
                    Password: (Use the password you registered with)

                    Login here: http://localhost:5173/theatre/login
                '''

                send_mail(

                    email_subject,
                    email_message,
                    'mhdasjad877@gmail.com', 
                    [user.email],
                    fail_silently=True
                )


                return Response(
                    {'message': 'Ownership status updated successfully!'},
                    status=status.HTTP_200_OK
                )
            else:
                
                # theatre_owner.delete()
                
                username = user.username
                email_subject = 'Theatre Verification Has Been Rejected' 
                email_message = f'''
                    Dear {username},
                    Your registration has been unvalidated due to some reasons
                    try to register with propper theatre docs and connect with us 
                    Thank you for letting know
                '''
                
                send_mail(

                    email_subject,
                    email_message,
                    settings.EMAIL_HOST_USER,
                    [user.email],
                    fail_silently=True
                )
                
                return Response(
                    {'message' : 'theatre ownership rejected successfully'},
                    status=status.HTTP_200_OK
                )
    
        
        except TheaterOwnerProfile.DoesNotExist :
            return Response(
                {"error" : "Theatre or pofile not available"},
                status=status.HTTP_404_NOT_FOUND
            )
            
            
# checking theatre owner for the pending theatres
class validateowner(APIView):
    def get(self , request):
        owner_id = request.GET.get('owner_id')
        print(owner_id)
        theatre_without_screen = Theatre.objects.annotate(screen_count=Count('screens')).filter( owner = owner_id  ,screen_count=0)
        print(theatre_without_screen)
        if theatre_without_screen.exists() :
            return Response({'error':'you have to verify other pending theatre'},status=status.HTTP_400_BAD_REQUEST)
        
        else : 
            return Response({'message' : 'valid one'},status=status.HTTP_200_OK) 
        
# fetching all movies data
class FetchAllMovies(APIView):
    def get(self , request):
        try :
            Movies = Movie.objects.filter().order_by('-created_at')
            serializer = FetchMovieSerializer(Movies , many=True,context={'request':request})
            return Response(serializer.data)
        except Exception as e:
            print(serializer.errors)
            return Response({'error': str(e)},status=500)
     
# fetching all the showtimes for the theatre   
class fetch_showtime(APIView):
    def get(self , request , theatre_id):      
        print(theatre_id, 'reached in the vieews')  
        try :
            screens = Screen.objects.filter(theatre=theatre_id)
            if not screens.exists():
                return Response({'error': 'No screens found'}, status=status.HTTP_404_NOT_FOUND)
            
            showtimes = ShowTime.objects.filter(screen__in=screens).prefetch_related('movie' , 'slots' , 'screen')
            serializer = FetchShowTimeSerializer(showtimes , many=True , context={'request' : request})
            return Response(serializer.data , status=status.HTTP_200_OK)

        except Exception as e:
            print('error while fetching showtime' , str(e))
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# show pending theatres for the theatre owner
class pending_theatres(APIView):
    def get(self , request , owner_id):
        theatre_owner = TheaterOwnerProfile.objects.get(id =owner_id)
        pendings = Theatre.objects.filter(owner = theatre_owner)
        if pendings is None :
            return Response({'warning' : 'no theatres to verify'},status=status.HTTP_200_OK)
        print(pendings)
        pending_li = []
        for pending in pendings:
            pending_dict = {
                'id' : pending.id,
                'name' : pending.name,
                'city' : pending.city.name ,
                'address' : pending.address,
                'is_confirmed' : pending.is_confirmed ,
                'has_screens' : pending.has_screen()
                
            }
            pending_li.append(pending_dict)
            
        return JsonResponse(pending_li , safe=False)
    
# creating a screen for the theatre
class CreateScreen(APIView):
    def post(self , request):
        data = request.data
        theatre_id = data['theatre']
        screen_no = data['screen_number']
        Screen_type = list(data['screen_type'])
        time_slots = data['time_slots']
    
        Screen_Occurs = Screen.objects.filter(theatre=theatre_id ,screen_number =  screen_no)
        if Screen_Occurs.exists():
            return Response({'error' : f'Screen {screen_no} already exist'} , status=status.HTTP_400_BAD_REQUEST)
        if len(time_slots) > 7 :
            return Response({'error' : 'max 7 time slots available per day'} , status=status.HTTP_400_BAD_REQUEST)
        c = 0
        for i in Screen_type :
            if i.isalpha() :
                c += 1
        if c <= 2  :
            if ''.join(Screen_type).lower() not in ['2d' , '3d' , '4dx']:
                return Response({'error' : 'not a valid screen type'}, status=status.HTTP_400_BAD_REQUEST)
            else :
                return Response({'error' : 'add more about screen type'},status=status.HTTP_400_BAD_REQUEST)
            
        data = request.data.copy() 
        data['selected_seats'] = [ seat['label'] for seat in data['unselected_seats']]
        serializers = CreateScreenSerializer(data=data)
        if serializers.is_valid():
            serializers.save()
            return Response({'message':'screen for theatre is created'},status=status.HTTP_201_CREATED)
        
        print(serializers.errors)
        return Response(serializers.errors , status=status.HTTP_400_BAD_REQUEST)

# show verified theatres for the theatre owner
class ShowVerifiedTheatre(APIView):
    def get(self , request ) :
        owner = request.query_params.get('owner_id')
        print(owner)
        
        try :
            available_theatres = Theatre.objects.filter(owner=owner, is_confirmed=True)
            
            theatre_data = [
                {
                    'id' : theatre.id,
                    'theatre_name' : theatre.name,
                    'city_name': theatre.city.name,
                    'state': theatre.city.state,
                    'address':theatre.address,
                    'pincode': theatre.city.pincode
                }
                for theatre in available_theatres
            ]
            print(theatre_data)
            return Response({
                'available_theatre': theatre_data    
            },status=status.HTTP_200_OK)
        
        except Theatre.DoesNotExist:
            return Response({
                'error': 'Verified Theatre not found'
            }, status=status.HTTP_404_NOT_FOUND)   
# get theatre screens for the theatre owner
class get_theatre_screens(APIView):
    def get(self , request):
        print(request.data)
        theatre = request.query_params.get('theatre_id')
        screens = Screen.objects.filter(theatre = theatre  ).order_by('screen_number')
        screen_count = screens.count()
        serializer = CreateScreenSerializer(screens , many=True)
        print(serializer.data)
        return Response({'data' : serializer.data ,'screen_count':screen_count}, status=status.HTTP_200_OK)
            
# get all the time slots for the screen
class get_timeslots(APIView) :
    def get(self ,request ):
        screen_id = request.query_params.get('screen_id')
        screen = Screen.objects.get(id=screen_id)
        
        try :
            time_slots = TimeSlot.objects.filter(screen = screen_id)
            
        except TimeSlot.DoesNotExist :
            return Response({'error' : 'timeslot not added'} , status=status.HTTP_404_NOT_FOUND)
            
        serilizer = TimeSlotSerializer(time_slots , many=True)
        return Response({'data' : serilizer.data , 'is_approved' : screen.is_approved }, status=status.HTTP_200_OK)

# adding time slots for the screen
class create_timeslot(APIView):
    def post(self , request) :
        
        data = request.data
        
        try :
            show_time = data.pop("start_time")
            screen_id = data.pop("screen_id")
            show_time_obj = datetime.strptime(show_time, "%H:%M:%S").time()
            new_start_dt = datetime.combine(datetime.today(), show_time_obj)
            print(new_start_dt)
            new_end_dt = new_start_dt + timedelta(hours=3)
            formatted_time = show_time_obj.strftime('%I:%M %p')
            
            screen_times = TimeSlot.objects.filter(screen = screen_id)
    
            for time in screen_times :
                existing_start_dt = datetime.combine(datetime.today() , time.start_time)
                existing_end_dt = existing_start_dt + timedelta(hours=3)
                print(time.start_time , existing_end_dt)
                if new_start_dt < existing_end_dt and existing_start_dt < new_end_dt :
                    return Response({'Error' : 'during this time already show time added'},status=status.HTTP_400_BAD_REQUEST)
                
            screen = Screen.objects.get(id=screen_id)
        
            TimeSlot.objects.create(
                screen=screen ,
                start_time = show_time
            )
            return Response({'message' : f'show time {formatted_time} created on screen {screen.screen_number}' } , status=status.HTTP_201_CREATED)
        except Exception as e :
            return Response({'error' : str(e)} , status=status.HTTP_400_BAD_REQUEST)
        
# adding show time for the screen
class Add_Show_Time(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self , request):
        data = request.data
        slot_ids = data.get('slot',[])
        screen_id = data.get('screen')
        show_date = data.get('show_date')
        end_date = data.get('end_date')
        
        logger.info(f"Received slot IDs: {slot_ids}")
        timeslot = TimeSlot.objects.filter(id__in = slot_ids)
        logger.info(f"Filtered timeslot: {timeslot}")

            
        
        try :
            if timeslot.count() != len(slot_ids):
                return Response({'Error' : 'invalid time slot id'} , status=status.HTTP_400_BAD_REQUEST)
            
        except:
            return Response({'Error' : ' time slot does not exist'} , status=status.HTTP_400_BAD_REQUEST)
        
        each_slot = timeslot.first()
        date_time = show_date + ' ' + str(each_slot.start_time)
        
        try:
            start_time = datetime.strptime(date_time , "%Y-%m-%d %H:%M:%S")
            start_time = timezone.make_aware(start_time)
            
            from_date = datetime.strptime(show_date, "%Y-%m-%d").date()
            if not end_date:
                return Response({'Error': 'end date is required'}, status=status.HTTP_400_BAD_REQUEST)
            to_date = datetime.strptime(end_date , '%Y-%m-%d').date()
            
            print(to_date)
            
            today = date.today()
            if not to_date :
                return Response({'Erorr' : 'to date is required'} , status=status.HTTP_400_BAD_REQUEST)
            
            if to_date <= from_date :
                print('not validd')
                return Response({'Error' : 'to date must be greater that start date'} , status=status.HTTP_400_BAD_REQUEST)
            if from_date < today : 
                return Response({'Error':'from date canot be in the past'},status=status.HTTP_400_BAD_REQUEST)
            
            if start_time <= timezone.now():
                
                return Response({'Error':'show time must be in the future'},status=status.HTTP_400_BAD_REQUEST)
            
            
            try:
                screen = Screen.objects.get(id=screen_id)
            except Screen.DoesNotExist:
                return Response({'Error': 'Invalid screen ID'}, status=status.HTTP_400_BAD_REQUEST)
            
            # checking overlaping show time
            
            for slot_id in slot_ids:
                if ShowTime.objects.filter(screen=screen , slots=slot_id , show_date=show_date).exists():
                    return Response({'Error': 'This screen already has a show during this (date and time)'}, status=status.HTTP_400_BAD_REQUEST)
            
            serializers = Createshowtimeserializers(data=data)
            if serializers.is_valid():
                serializers.save()
                return Response({'message':'show time data successfully create'},status=status.HTTP_201_CREATED)
            print(serializers.errors)
            return Response({'Error' : serializers.errors} , status=status.HTTP_400_BAD_REQUEST)
                
        except ValueError as e :
            return Response({'Error': f'Invalid date format: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
# add theatres
class AddTheatre(APIView) :
    def post(self , request , city_id ) :
        print(city_id)
        try :
            city = City.objects.get(id = city_id)

        except City.DoesNotExist :
            return Response({ "error" : "city not found" },status=status.HTTP_404_NOT_FOUND)

        name = request.data.get('name')
        address = request.data.get('address')
        owner_id = request.data.get('owner_id')

        theatre = Theatre.objects.filter(name__icontains=name , city=city)
        if theatre.exists():
            return Response({'error' : 'theatre is already exists'} , status=status.HTTP_400_BAD_REQUEST)
        try:
            owner = TheaterOwnerProfile.objects.get(id = owner_id)
            theatre, created = Theatre.objects.get_or_create(
                owner = owner,
                name=name,
                city=city,
                defaults={'address': address}   
            )
            if not created:
                return Response(
                    {"error": f"Theatre {name} already exists for this owner in this city."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            return Response(
                {'message': f"Theatre {theatre.name} created successfully"},
                status=status.HTTP_201_CREATED
            )
        
        except TheaterOwnerProfile.DoesNotExist:
            return Response({"error": "Owner not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response(
                {"error" : f"An erorr occurred : {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
            
# edit theatre data
class EditTheatreData(APIView):
    def get(self , request , id) :
        try :
            theatre = Theatre.objects.get(id = id)
            print(theatre.city.id)
        except Theatre.DoesNotExist:
            return Response({'message':'theatre is not found'},status=status.HTTP_404_NOT_FOUND)
        data = []
        theatre_data = {
            "name" : theatre.name , 
            "address" : theatre.address,
            "cityid" : theatre.city.id

        }
        data.append(theatre_data)
        return Response(data,status=status.HTTP_200_OK)
    
    def put(self , request , id) :
        try :
            theatre = Theatre.objects.get(id = id)

        except Theatre.DoesNotExist:
            return Response({'message':'theatre is not found'},status=status.HTTP_404_NOT_FOUND)
        
        name = request.data.get('name')
        address = request.data.get('address')
        print(address,'adress')

        if not name or not address :
            return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

        theatre.name = name
        theatre.address = address
        theatre.save()
        return Response({'message' : 'theatre updated successfully'}, status=status.HTTP_200_OK)
# delete theatre data
class DeleteTheatre(APIView) :
    
    def delete(self , request , id) :
        print(f"Received request to delete theatre with ID: {id}")

        try :
            theatre = Theatre.objects.get(id = id)
        except Theatre.DoesNotExist :
            return Response({"error": "Theatre not found"}, status=status.HTTP_404_NOT_FOUND)
        
        theatre.delete()
        return Response({"message": "Theatre deleted successfully"}, status=status.HTTP_200_OK)

def get_date_range(start_date, end_date):
    start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
    end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
    return [start_date + timedelta(days=i) for i in range((end_date - start_date).days + 1)]

# editing show date view

class Edit_show_det(APIView):
    def get(self, request, slot_id):
        """Get show time details for editing"""
        try:
            show_slot = ShowSlot.objects.filter(slot=slot_id).select_related(
                'slot', 'showtime__movie', 'showtime__screen'
            )
            
            start_show = show_slot.first()
            end_show = show_slot.last()
            if not show_slot:
                return Response(
                    {'error': 'Show slot not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            show = start_show.showtime
            slot = start_show.slot
            
            details = {
                'start_date': show.show_date.strftime('%Y-%m-%d') if show.show_date else None,
                'end_date': end_show.showtime.show_date.strftime('%Y-%m-%d') if end_show.showtime.show_date else None,
                'show_time': slot.start_time.strftime('%H:%M:%S'),
                'end_time': end_show.calculated_end_time.strftime('%H:%M:%S') if end_show.calculated_end_time else None,
                'screen': show.screen.id,
                'movie': show.movie.id,
                'slot': slot.id,
                'movie_title': show.movie.title,
                'screen_number': show.screen.screen_number,
                'theatre_name': show.screen.theatre.name,
            }
            
            return JsonResponse(details, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error fetching show details: {str(e)}")
            return Response(
                {'error': 'Error fetching show details'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request, slot_id):
        data = request.data.copy()
        
        try:
            # Validate required fields
            required_fields = ['start_time', 'show_date', 'end_date', 'screen', 'movie']
            for field in required_fields:
                if field not in data:
                    return Response(
                        {'Error': f'{field} is required'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )

            # Parse time inputs
            start_time_str = data.get('start_time')
            end_time_str = data.get('end_time')
            
            if len(start_time_str) == 5:  # HH:MM format
                start_time_str += ':00'
            if end_time_str and len(end_time_str) == 5:
                end_time_str += ':00'
                
            start_time_obj = datetime.strptime(start_time_str, "%H:%M:%S").time()
            end_time_obj = datetime.strptime(end_time_str, "%H:%M:%S").time() if end_time_str else None
            
            show_date = datetime.strptime(data['show_date'], "%Y-%m-%d").date()
            end_date = datetime.strptime(data['end_date'], "%Y-%m-%d").date()
            
            # Validate date range
            if end_date < show_date:
                return Response(
                    {'Error': 'End date cannot be before start date'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                screen = Screen.objects.get(id=data['screen'])
                movie = Movie.objects.get(id=data['movie'])
                slot = TimeSlot.objects.get(id=slot_id)
            except (Screen.DoesNotExist, Movie.DoesNotExist, TimeSlot.DoesNotExist) as e:
                return Response(
                    {'Error': f'Invalid reference: {str(e)}'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Calculate movie end time based on duration
            start_dt = datetime.combine(datetime.today(), start_time_obj)
            movie_end_dt = start_dt + timedelta(minutes=movie.duration)
            calculated_end_time = movie_end_dt.time()
            
            # If custom end time is provided, validate it
            if end_time_obj:
                custom_end_dt = datetime.combine(datetime.today(), end_time_obj)
                if custom_end_dt < movie_end_dt:
                    return Response(
                        {'Error': f'End time must be at least {movie.duration} minutes after start time (movie duration)'}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                calculated_end_time = end_time_obj

            conflicting_slots = TimeSlot.objects.filter(
                screen=screen
            ).exclude(id=slot_id)
            
            for existing_slot in conflicting_slots:
                existing_show_slot = ShowSlot.objects.filter(
                    slot=existing_slot
                ).select_related('showtime__movie').first()
                
                if existing_show_slot:
                    existing_start = datetime.combine(datetime.today(), existing_slot.start_time)
                    if existing_show_slot.calculated_end_time:
                        existing_end = datetime.combine(datetime.today(), existing_show_slot.calculated_end_time)
                    else:
                        existing_end = existing_start + timedelta(minutes=existing_show_slot.showtime.movie.duration)
                    
                    new_start = datetime.combine(datetime.today(), start_time_obj)
                    new_end = datetime.combine(datetime.today(), calculated_end_time)
                    
                    # Check for overlap
                    if (new_start < existing_end and existing_start < new_end):
                        return Response(
                            {'Error': f'Time slot conflicts with existing show at {existing_slot.start_time}'}, 
                            status=status.HTTP_400_BAD_REQUEST
                        )

            # Update the time slot
            old_start_time = slot.start_time
            if old_start_time != start_time_obj:
                slot.start_time = start_time_obj
                slot.save()
                logger.info(f"Updated slot {slot_id} start time from {old_start_time} to {start_time_obj}")

            # Get existing show dates for this slot, screen, and movie combination
            existing_dates = set(
                ShowTime.objects.filter(
                    screen=screen,
                    slots=slot,
                    movie=movie,
                    show_date__range=(show_date, end_date)
                ).values_list('show_date', flat=True)
            )

            current_date = show_date
            dates_to_create = []
            while current_date <= end_date:
                if current_date not in existing_dates:
                    dates_to_create.append(current_date)
                current_date += timedelta(days=1)

            # Create new ShowTime and ShowSlot objects for missing dates
            created_count = 0
            for date_to_create in dates_to_create:
                show = ShowTime.objects.create(
                    movie=movie,
                    screen=screen,
                    show_date=date_to_create,
                    end_time=calculated_end_time
                )
                
                show_slot = ShowSlot.objects.create(
                    showtime=show, 
                    slot=slot,
                    calculated_end_time=calculated_end_time
                )
                created_count += 1

            # Update existing ShowSlot calculated_end_time
            ShowSlot.objects.filter(slot=slot).update(
                calculated_end_time=calculated_end_time
            )
        
            ShowTime.objects.filter(
                slots=slot,
                screen=screen,
                movie=movie,
                show_date__range=(show_date, end_date)
            ).update(end_time=calculated_end_time)

            return Response({
                'message': 'Successfully updated show details',
                'created_shows': created_count,
                'updated_slot': slot_id
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response(
                {'Error': f'Invalid date/time format: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Error updating show: {str(e)}")
            return Response(
                {'Error': f'Server error: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        
# get all the bookings for the theatre owner
class Get_Theatre_Bookings(APIView):
    def get(self , request):
        owner = request.query_params.get('owner_id')
        try:
                
            booking = Booking.objects.filter(
                show__screen__theatre__owner=owner
            ).select_related(
                'user',
                'show__movie',
                'show__screen__theatre',
                'show__screen',
                'show__movie',
                'payment'
            ).order_by('-booking_time')
            
            booking_data = []
            for book in booking :
                booking_dict = {
                    'id' : book.id,
                    'booking_id' : book.booking_id,
                    'movie_name' : book.show.movie.title,
                    'theatre_name' : book.show.screen.theatre.name,
                    'screen_number' : book.show.screen.screen_number,
                    'show_date' : book.show.show_date,
                    'start_time' : book.slot.start_time,
                    'total_price' : book.amount,
                    'status' : book.status,
                    'user_name' : f"{book.user.username}",
                    'user_email' : book.user.email,}
                booking_data.append(booking_dict)
                
            return Response({'booking_data' : booking_data} , status=status.HTTP_200_OK)
            
        except Exception as e:
            print(str(e))
            return Response({'error' : str(e)} , status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DashboardStatus(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self , request , owner_id):
        try :
            theatres = Theatre.objects.filter(owner = owner_id)
            screens = [s.id for t in theatres for s in t.screens.all()]

            theatre_owner = TheaterOwnerProfile.objects.get(id=owner_id)
            
        except Theatre.DoesNotExist:
            return Response({'error' : 'theatre not found'} , status=status.HTTP_400_BAD_REQUEST)
        
        print(theatre_owner)
        booking_queryset = Booking.objects.filter(
            show__screen__theatre__in=theatres,
            show__screen__id__in = screens,
            status='confirmed',
        )
        
        total_amount = booking_queryset.aggregate(Sum('amount'))['amount__sum'] or 0
        admin_revenue = float(total_amount) * 0.10
        theatre_revenue = float(total_amount) * 0.90

        
        total_tickets = BookingSeat.objects.filter(
            booking__in = booking_queryset,
            status = 'booked'
        ).count()
        
        return Response({
            'total_tickets': total_tickets,
            'total_revenue': total_amount,
            'admin_revenue': admin_revenue,
            'theatre_revenue': theatre_revenue,
            'total_theatres' : len(theatres)
            
        },status=status.HTTP_200_OK)

# theatre owner revenue tracking view
class Revenue_Chart(APIView):
    permission_classes = [permissions.AllowAny]
    def get(self , request):
        period = request.GET.get('period', 'month')
        theatres = Theatre.objects.filter(owner__user_id=request.user)
        screens = [s.id for t in theatres for s in t.screens.all()]
        # Time range
        today = now().date()
        if period == "week":
            start_date = today - timedelta(days=7)
        elif period == "month":
            start_date = today - timedelta(days=30)
        elif period == "year":
            start_date = today - timedelta(days=365)
        else:
            start_date = today - timedelta(days=30)
            
        logger.info(screens)

        seat_counts = BookingSeat.objects.filter(
            booking=OuterRef('pk'),
            status='booked'
        ).values('booking').annotate(
            count=Count('id')
        ).values('count')

        # Step 1: Annotate bookings with ticket count using subquery
        bookings = Booking.objects.filter(
            status='confirmed',
            show__screen__id__in=screens,
            booking_time__date__gte=start_date
        ).annotate(
            ticket_count=Subquery(seat_counts)
        ).values('booking_time__date').annotate(
            total=Sum('amount'),
            tickets=Sum('ticket_count')
        ).order_by('booking_time__date')
        logger.info(f'confirmed booking{bookings}')

        date_to_total = {
            entry['booking_time__date']: {
                'total': entry['total'],
                'tickets': entry['tickets']
            }
            for entry in bookings
        }        
        
        data = []
        current_date = start_date
        while current_date <= today:
            totals = date_to_total.get(current_date , {'total' : 0 , 'tickets':0})
            data.append({
                'date': current_date.isoformat(),
                'revenue': round(float(totals['total']) * 0.9 , 2),
                'tickets': totals['tickets'],
            })
            current_date += timedelta(days=1)

        return Response(data , status=status.HTTP_200_OK)