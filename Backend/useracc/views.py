from django.shortcuts import render
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer , OtpVerificationSerializer , RegisterSerializers , UserEditSerializers
from .models import User
from django.contrib.auth import authenticate
import json
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login
from django.views import View
from allauth.socialaccount.models import SocialAccount

class UserRegisterView(APIView) :
    def post(self , request ):
        print(request.data , 'post man')
        serializer =  RegisterSerializers(data=request.data)
        if serializer.is_valid():
            try :
                user = serializer.save()
                print(user)
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
                'id' : user.id ,
                'username' : user.username , 
                'email' : user.email
            }
            print(user_data)
            return Response({'user' : user_data ,"message" : "OTP Verified Successfully "}, status=status.HTTP_200_OK )
        print(serializer.errors)
        return Response({'errors' : serializer.errors} , status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView) :
    def post(self , request , *args , **kwargs ) :
        try :
            data = request.data
            username = data.get('username')
            password = data.get('password')
            user = authenticate(request , username=username , password=password)
            if user is not None :
                user_data = {
                    "id" : user.id ,
                    "username" : user.username,
                    "email" : user.email
                }
                return Response({'message' : 'logined successfully' , 'user' : user_data} ,status=status.HTTP_200_OK)
    
            return Response({'error' : 'invalid credentials'},status=status.HTTP_401_UNAUTHORIZED)
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt , name='dispatch')
class GoogleAuthView(View):
    def post(self , request):
        try :
            data = json.loads(request.body) 
            email = data.get('email')
            username = data.get('name') or email.split('@')[0]           
            user , created = User.objects.get_or_create(email=email,defaults={
                
                'username' : username,
                'password' : None, 
                
                }
            )
            if created :
                SocialAccount.objects.create(
                    user=user,
                    provider='google',
                    uid = email,
                    extra_data = data
                )
            else :
                user.username = username
                user.save()
            login(request , user, backend='django.contrib.auth.backends.ModelBackend')
                
            return JsonResponse({
                'success' : True,
                'user' :{
                    'id' : user.id,
                    'email' : user.email,
                    'username' : user.username
                }
            })
        except Exception as e:
                return JsonResponse({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
            
class editUser(APIView):
    def put(self , request , userId):
        try :
            
            user = User.objects.get(id=userId)
            
        except User.DoesNotExist:
            return Response({'error' : 'user not found'} , status=status.HTTP_404_NOT_FOUND)
        
        serializers = UserEditSerializers(instance=user , data=request.data , partial = True)
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data , status=status.HTTP_200_OK)
        return Response(serializers.errors , status=status.HTTP_400_BAD_REQUEST)