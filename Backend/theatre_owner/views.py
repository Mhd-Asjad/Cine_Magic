from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from .models import TheaterOwnerProfile
from .serializers import TheatreOwnerSerialzers , FetchMovieSerializer , CreateScreenSerializer , Createshowtimeserializers , TimeSlotSerializer , UpdateTheatreOwnerSeriailizer
from rest_framework.permissions import IsAuthenticated , AllowAny
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from movies.models import *
from theatres.models import Theatre , Screen , ShowTime , TimeSlot
from useracc.models import User
from django.http import JsonResponse
from django.db import IntegrityError
from datetime import datetime , timedelta
from django.utils import timezone
from django.db.models import Count

# Create your views here.
class CreateOwnershipProfile(APIView) :
    permission_classes = [AllowAny]
    def post(self , request ) :

        data = request.data
        user_id = data['user']
        print(data)
        user =  User.objects.get(id = user_id)
        if user.is_staff :
            return Response({'error' : 'admin cant register as a theatre owner'},status=status.HTTP_400_BAD_REQUEST)
        if TheaterOwnerProfile.objects.filter(user=user.id).exists():
            return Response({'error' : 'you have already once registered for theatre ownership'},status=status.HTTP_400_BAD_REQUEST)
            
        serializer = TheatreOwnerSerialzers(data = data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message' : 'request has been made soon update via mail'},status=status.HTTP_200_OK)
        print(serializer.errors)
        return Response(serializer.errors , status=status.HTTP_400_BAD_REQUEST)
    
class Update_theatreowner(APIView):
    def put(self , request , pk):
        try :
            owner = TheaterOwnerProfile.objects.get(pk=pk)
        except TheaterOwnerProfile.DoesNotExist:
            return Response({'error':'owner not found'},status=status.HTTP_404_NOT_FOUND)
        
        serializer = UpdateTheatreOwnerSeriailizer(instance=owner , data=request.data , partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data , status=status.HTTP_200_OK) 
        
        print(serializer.errors)
        return Response(serializer.errors , status=status.HTTP_400_BAD_REQUEST)
    
class ConfirmTheatreOwner(APIView) :
    # getting unverified theatre enquries 
    def get(self , request ) :
        try :
            unverified_theatre = TheaterOwnerProfile.objects.filter(ownership_status = 'pending')
            data = []
            for theatre in unverified_theatre :
                enqueiry_data = {
                    'id' : theatre.id ,
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
        print(ownership_status)

        if not profile_id and ownership_status :
            return Response(
                {'error': 'Both id and ownership_status are required!'}
                ,status=status.HTTP_400_BAD_REQUEST
                
            )

        try :
            
            theatre_owner = TheaterOwnerProfile.objects.get(id=profile_id)
            theatre_owner.ownership_status = ownership_status
            theatre_owner.save()

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

                    Login here: http://localhost:3000/theatre-login
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
        except TheaterOwnerProfile.DoesNotExist :
            return Response(
                {"error" : "Theatre or pofile not available"},
                status=status.HTTP_404_NOT_FOUND
            )
            
            
class TheatreLogin(APIView) :
    def post(self , request ) :
        print('reached view')
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username = username , password = password)
        
        if user is None :
            return Response({'error' : 'invalid credentials '} , status=status.HTTP_400_BAD_REQUEST)

        try :
            
            theatre_owner = TheaterOwnerProfile.objects.get(user=user , ownership_status='confirmed')
            
        except TheaterOwnerProfile.DoesNotExist:
            return Response({"error": "Not confirmed as theatre owner"}, status=status.HTTP_404_NOT_FOUND)

        print(theatre_owner.ownership_status)
        not_allowed = ['Pending' , 'Rejected']
        if theatre_owner is None or theatre_owner.ownership_status in not_allowed :
            return Response({"error": "Not a valid theatre owner"}, status=status.HTTP_403_FORBIDDEN)
        print(theatre_owner.ownership_status)  
        refresh =  RefreshToken.for_user(user)

        return Response({
            "message" : 'login successfull',
            "access_token" : str(refresh.access_token) , 
            "refresh_token" : str(refresh),
            "theatre_owner": {
                "owner_id" : theatre_owner.user.id ,
                "id": theatre_owner.id,
                "theatre_name": theatre_owner.theatre_name,
                "location": theatre_owner.location,
                "state": theatre_owner.state,
                "pincode": theatre_owner.pincode,
                "ownership_status": theatre_owner.ownership_status,
            },
        },status=status.HTTP_200_OK)
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
        
        
class FetchAllMovies(APIView):
    def get(self , request):
        try :
            Movies = Movie.objects.all()
            serializer = FetchMovieSerializer(Movies , many=True,context={'request':request})
            return Response(serializer.data)
        except Exception as e:
            print(serializer.errors)
            return Response({'error': str(e)},status=500)
        
class fetch_showtime(APIView):
    def get(self , request , theatre_id):      
        print(theatre_id, 'reached in the vieews')  
        try :
            screens = Screen.objects.filter(theatre=theatre_id)
            if not screens.exists():
                return Response({'error': 'No screens found'}, status=status.HTTP_404_NOT_FOUND)
            
            showtimes = ShowTime.objects.filter(screen__in=screens)
            serializer = Createshowtimeserializers(showtimes , many=True)
            return Response(serializer.data , status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class pending_theatres(APIView):
    def get(self , request):
        theatre_owner = TheaterOwnerProfile.objects.get(user=request.user)
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
        serializers = CreateScreenSerializer(data=request.data)
        if serializers.is_valid():
            serializers.save()
            return Response({'message':'screen for theatre is created'},status=status.HTTP_201_CREATED)
        print(serializers.errors)
        return Response(serializers.errors , status=status.HTTP_400_BAD_REQUEST)



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
            return Response({
                'available_theatre': theatre_data    
            },status=status.HTTP_200_OK)
        
        except Theatre.DoesNotExist:
            return Response({
                'error': 'Verified Theatre not found'
            }, status=status.HTTP_404_NOT_FOUND)   
            
class get_theatre_screens(APIView):
    def get(self , request):
        print(request.data)
        theatre = request.query_params.get('theatre_id')
        screens = Screen.objects.filter(theatre = theatre).order_by('screen_number')
        screen_count = screens.count()
        serializer = CreateScreenSerializer(screens , many=True)
        print(serializer.data)
        return Response({'data' : serializer.data ,'screen_count':screen_count}, status=status.HTTP_200_OK)
            
class get_timeslots(APIView) :
    def get(self ,request ):
        screen_id = request.query_params.get('screen_id')
        print(screen_id,'inside views') 
        try :
            time_slots = TimeSlot.objects.filter(screen = screen_id)
            
        except TimeSlot.DoesNotExist :
            return Response({'error' : 'timeslot not added'} , status=status.HTTP_404_NOT_FOUND)
            
        serilizer = TimeSlotSerializer(time_slots , many=True)
        return Response(serilizer.data , status=status.HTTP_200_OK)
        
    
class Add_Show_Time(APIView):
    def post(self , request):
        data = request.data
        timeslot_id = data.get('slot')
        screen_id = data.get('screen')
        show_date = data.get('show_date')
        timeslot = TimeSlot.objects.get(id = timeslot_id)
        date_time = show_date + ' ' + str(timeslot.start_time)
        try:
            start_time = datetime.strptime(date_time , "%Y-%m-%d %H:%M:%S")
            start_time = timezone.make_aware(start_time)
            
            if start_time <= timezone.now():
                return Response({'Error':'start time must be in the future'},status=status.HTTP_400_BAD_REQUEST)
            
            try:
                screen = Screen.objects.get(id=screen_id)
            except Screen.DoesNotExist:
                return Response({'Error': 'Invalid screen ID'}, status=status.HTTP_400_BAD_REQUEST)
            
            overlapping_shows = ShowTime.objects.filter(
                screen=screen ,
                slot = timeslot_id,
                show_date = show_date,
            )
            print(overlapping_shows)
            if overlapping_shows.exists():
                print('there is overlapping showww')    
                return Response({'Error': 'This screen already has a show during this (date and time)'}, status=status.HTTP_400_BAD_REQUEST)
            print(data)
            serializers = Createshowtimeserializers(data=data)
            if serializers.is_valid():
                serializers.save()
                return Response({'message':'show time data successfully create'},status=status.HTTP_201_CREATED)
            print(serializers.errors)
            return Response({'Error' : serializers.errors} , status=status.HTTP_400_BAD_REQUEST)
                
        except ValueError as e :
            return Response({'Error': f'Invalid date format: {str(e)}'}, status=400)
        
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

        if not name or not address :
            return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

        theatre.name = name
        theatre.address = address
        theatre.save()
        return Response({'message' : 'theatre updated successfully'}, status=status.HTTP_200_OK)

class DeleteTheatre(APIView) :
    
    def delete(self , request , id) :
        print(f"Received request to delete theatre with ID: {id}")

        try :
            theatre = Theatre.objects.get(id = id)
        except Theatre.DoesNotExist :
            return Response({"error": "Theatre not found"}, status=status.HTTP_404_NOT_FOUND)
        
        theatre.delete()
        return Response({"message": "Theatre deleted successfully"}, status=status.HTTP_200_OK)