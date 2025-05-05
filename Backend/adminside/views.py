from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from useracc.models import User
from django.http import JsonResponse
from .serilizers import CitySerializers ,TheatreSerializer , MovieSerializers
from movies.models import City , Movie
from theatres.models import *
from theatre_owner.models import *
from rest_framework.decorators import api_view


# Create your views here.

class AdminLoginView(APIView) :
    def post(self , request) :
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request , username = username , password = password)
        if user is not None and user.is_staff :
            print('user authenticated')
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response({

                'access' : access_token ,
                'refresh' : str(refresh)

            },status=status.HTTP_200_OK)

        else :
            return Response({
                'detail' : 'invalid credentials or user is not an admin'
            },status=status.HTTP_400_BAD_REQUEST)

class UserListView(APIView):
    def get(self , request):
        users = User.objects.all().values().order_by('id')
        user_list = list(users)
        return JsonResponse(user_list, safe=False)
    
class UserStatusUpdate(APIView) :
    def post(self , request , pk) :
        try :
            user = User.objects.get(pk=pk)
            user.is_active = not user.is_active
            user.save()
            return Response({'message': 'user status updated successfully'},status=status.HTTP_200_OK)
        except user.DoesNotExist:
            return Response({ 'error' : 'user not found'},status=status.HTTP_404_NOT_FOUND)

class CreateCity(APIView) :
    def post(self , request) :
        serializer = CitySerializers(data = request.data)
        if serializer.is_valid() :
            serializer.save()
            
            return Response({"message":'city was created successfully' , "data" : serializer.data},status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class CityTheatreView(APIView) :
    def get(self , request , city_id) :
        try :
            city = City.objects.get(id = city_id)
            
            theatres = Theatre.objects.filter(city = city)
            serialzer = TheatreSerializer(theatres , many=True)
            response_data = {
                "cityname" : city.name,
                "theatres" : serialzer.data
            }
            return Response(response_data , status=status.HTTP_200_OK)
        except City.DoesNotExist:
            return Response({"detail" : 'no theatre found'},status=status.HTTP_404_NOT_FOUND)
        except Exception as e :
            return Response({'detail' : str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class AddTheatre(APIView) :
    def post(self , request , owner_id ) :

        try :
            city = TheaterOwnerProfile.objects.get(id = owner_id)

        except TheaterOwnerProfile.DoesNotExist :
            return Response({ "detail" : "city not found" },status=status.HTTP_404_NOT_FOUND)

        name = request.data.get('name')
        address = request.data.get('address')

        if not name or not address :
            return Response({"detail" : "name and address are required"},status=status.HTTP_400_BAD_REQUEST)
        

        try :

            theatre = Theatre.objects.create(

                name = name,
                city = city ,
                address = address
            )
            return Response(
                {'detail' : f"theatre {theatre.name} created successfully"},
                status=status.HTTP_201_CREATED
            )

        except Exception as e :
            return Response(
                {"detail" : f"An erorr occurred : {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class DeleteTheatre(APIView) :
    def delete(self , request , id):
        print(id)
        print('reaches the view')
        try :
            theatre = Theatre.objects.get(id = id)
        except Theatre.DoesNotExist :
            return Response({"error": "Theatre not found"}, status=status.HTTP_404_NOT_FOUND)
        
        theatre.delete()
        return Response({"message": "Theatre deleted successfully"}, status=status.HTTP_200_OK)

# Movies View ( CRUD )
class ListMovies(APIView) :
    def get(self , reqeust) :
        queryset = Movie.objects.all()

        movie_list = []
        for movie in queryset :

            movie_dict = {

                'id': movie.id,
                'title': movie.title,
                'language': movie.language,
                'duration': movie.duration,
                'release_date': movie.release_date,
                'description': movie.description,
                'genre': movie.genre,
                'poster' : reqeust.build_absolute_uri(movie.poster.url) if movie.poster else None
            }

            movie_list.append(movie_dict)
        return JsonResponse(movie_list , safe=False)

        

class CreateMovieView(APIView) :
    def post(self , request) :
        data = request.data
        print(data)
        serializer = MovieSerializers(data= data)
        if serializer.is_valid() :
            serializer.save()
            return Response(
                {"message" : "Movie created successfully" , "data" : serializer.data},
                status=status.HTTP_201_CREATED,    
            )
        print(serializer.errors)
        return Response(
            serializer.errors ,status=status.HTTP_400_BAD_REQUEST
        )
class update_movie(APIView):     
    def get(self ,request , movie_id):   
        movie = Movie.objects.get(id=movie_id)
    
        serializer = MovieSerializers(movie)
        return Response(serializer.data)
    
    def put(self , request , movie_id):
        movie = Movie.objects.get(id=movie_id)
        print(request.data)
        serializer = MovieSerializers(movie, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Movie updated successfully", "movie": serializer.data})
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    
class DeleteMovies(APIView) :
    def delete(self , requst , id):
        try :
            movie = Movie.objects.get(id=id)
            
        except Movie.DoesNotExist:
            return Response({'error' : 'movie not found'} , status=status.HTTP_404_NOT_FOUND)
        movie.delete()
        return Response({'message' : f'{movie.title} deleted successfully'} , status=status.HTTP_200_OK)
    
class ShowTheatreRequest(APIView):
    def get(self , request) :   
        print('hello')
        try :
            
            theatres = Theatre.objects.filter(  screens__is_approved = False )
        except Theatre.DoesNotExist:
            return Response({'message' : 'pending theatres not found'},status=status.HTTP_404_NOT_FOUND)
        
        serializer = TheatreSerializer(theatres , many=True)
        print(serializer.data)
        return Response(serializer.data , status=status.HTTP_200_OK)
    
    def post(self , request ):
        try :   
            theatre_id = request.data.get('theatre_id')
            theatre_det = Theatre.objects.get(id = theatre_id)
            action = request.data.get('action')
            if action == 'confirmed':
                if not theatre_det.has_screen():
                    return Response(
                        {'error':'Theatre not have at least one screen details'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                theatre_det.is_confirmed = True
                theatre_det.save()
                
                screen_data = Screen.objects.filter(theatre=theatre_det,is_approved=False)
                if screen_data :
                    for screen in screen_data :
                        screen.is_approved = True
                        screen.save()

                
                return Response(
                    {'message' : 'theatre verified successfully'},
                    status=status.HTTP_200_OK
                )
                
        except Theatre.DoesNotExist:
            return Response(
                {'error':'theatre not found'},
                status=status.HTTP_404_NOT_FOUND
            )
@api_view(['get'])
def Verified_Theatres(request):
    theatres = Theatre.objects.filter(is_confirmed=True).order_by('-created_at')
    serializers = TheatreSerializer(theatres , many=True)
    return Response(serializers.data , status=status.HTTP_200_OK)

class verify_screen(APIView):
    def post(self , request,screen_id):
        print('view check✅')
        print(screen_id)
        try :
            screen = Screen.objects.get(id=screen_id)
            screen.is_approved = True
            screen.save()
            return Response({'message' : 'approved successfully'},status=status.HTTP_200_OK)
        
        except Screen.DoesNotExist:
            return Response({'error' : 'not found screen'}, status=status.HTTP_404_NOT_FOUND)
            
            
    def delete(self , request , screen_id):
        screen = Screen.objects.get(id=screen_id)
        screen_number = screen.screen_number
        theatre_name = screen.theatre.name
        screen.delete()
            
        return Response({'message' , f'Screen : {screen_number} from {theatre_name} deleted successfully  '})
    
    
@api_view(['DELETE'])
def Cancel_Show(request , show_id) :
    show = ShowTime.objects.get(id=show_id)
    screen_number = show.screen.screen_number
    movie = show.movie.title
    show.delete()
    return Response({'message' : f'{movie} on screen {screen_number} was successfully cancelled'})
    