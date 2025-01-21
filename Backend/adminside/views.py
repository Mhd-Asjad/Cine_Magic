from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from useracc.models import User
from django.http import JsonResponse
from .serilizers import CitySerializer ,TheatreSerializer , MovieSerializers
from movies.models import City , Movie
from theatres.models import Theatre

# Create your views here.


class AdminLoginView(APIView) :
    def post(self , request) :
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request , username = username , password = password)
        if user is not None and user.is_staff :
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
        

# cities

class CreateCity(APIView) :
    def post(self , request) :
        serializer = CitySerializer(data = request.data)
        if serializer.is_valid() :
            serializer.save()
            
            return Response({"message":'city was created successfully' , "data" : serializer.data},status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class DeleteCity(APIView) :
    def delete( self , request, city_id ):

        try :
            item = City.objects.get(id = city_id)

        except City.DoesNotExist :
            return Response({'error' : 'Item is not found'},status=status.HTTP_404_NOT_FOUND )

        item.delete()
        remaining_cities = list(City.objects.values('id' , 'name','state' , 'pincode'))
        return Response({"message":'City deleted successfully','remaining_cities':remaining_cities})
            

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
    def post(self , request , city_id ) :

        try :
            city = City.objects.get(id = city_id)

        except City.DoesNotExist :
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

        data = request.data.copy()
        temp = [ ]
        if 'cities' in data :
            for i in data['cities']: 
                temp.append(int(i))
        data['cities'] = temp

        serializer = MovieSerializers(data= request.data)
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
    