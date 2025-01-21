from django.shortcuts import render
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer , OtpVerificationSerializer , RegisterSerializers
from .models import User
from django.contrib.auth import authenticate
import json 
from django.http import JsonResponse

class UserRegisterView(APIView) :
    def post(self , request ):
        print(request.data , 'post man')
        serializer =  RegisterSerializers(data=request.data)
        if serializer.is_valid():
            try :
                user = serializer.save()
                return Response({'message' : 'user registered otp sended'} , status=status.HTTP_201_CREATED)
            except Exception as e :
                return Response({'error' : str(e)},status=status.HTTP_400_BAD_REQUEST)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyOtpView(APIView) :
    def post(self , request):
        serializer = OtpVerificationSerializer(data = request.data)
        if serializer.is_valid():
            user = serializer.save()

            user_data = {
                'id' : user.id,
                'username' : user.username , 
                'email' : user.email
            }
            print(user_data)
            return Response({'user' : user_data ,"message" : "OTP Verified Successfully "}, status=status.HTTP_200_OK )

        return Response({'errors' : serializer.errors} , status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView) :
    def post(self , request , *args , **kwargs ) :
        try :
            data = request.data
            username = data.get('username')
            password = data.get('password')

            user = authenticate(request , username=username , password=password)
            user = User.objects.get(username=username)
            user_data = {
                "username" : user.username,
                "email" : user.email
            }
            
            if user is not None :
                return Response({'message' : 'logined successfully' , 'user' : user_data} ,status=status.HTTP_200_OK)
            
            return Response({'error' : 'invalid credentials'},status=status.HTTP_401_UNAUTHORIZED)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        

