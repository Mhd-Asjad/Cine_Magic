from django.shortcuts import render
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status , permissions
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
from rest_framework_simplejwt.tokens import RefreshToken
from theatre_owner.serializers import TheatreOwnerSerialzers
from theatre_owner.models import TheaterOwnerProfile
class UserRegisterView(APIView) :
    permission_classes = [permissions.AllowAny]
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
    permission_classes = [permissions.AllowAny]
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
    permission_classes = [permissions.AllowAny]
    def post(self , request , *args , **kwargs ) :
        try :
            data = request.data
            username = data.get('username')
            password = data.get('password')
            user_type = data.get('user_type' , 'normal')
            user = authenticate(request , username=username , password=password)
        
            if user is None :
                return Response({'error' : 'invalid credentials'},status=status.HTTP_401_UNAUTHORIZED)
    
            if user_type == 'admin' and not user.is_staff :
                return Response({'error' : 'User is unautherized as Admin'})
            
            theatre_data = None
            print(user.is_approved)
            if user_type == 'theatre':
      

                if not user.is_theatre_owner:

                    return Response({
                        'error': 'User is not registered as a theatre owner'
                    }, status=status.HTTP_403_FORBIDDEN)
                
                if not user.is_approved :
                    return Response({'error' : 'your theatre owner account is pending approval'},status=status.HTTP_400_BAD_REQUEST)
                
                
                try :
                    owner_data = TheaterOwnerProfile.objects.get(user=user)
                    serializer = TheatreOwnerSerialzers(instance=owner_data)
                    theatre_data = serializer.data
                    
                except TheaterOwnerProfile.DoesNotExist:
                        
                    return Response({'error': 'Theatre owner profile not found'},
                    status=status.HTTP_404_NOT_FOUND)
            
            refresh = RefreshToken.for_user(user)
           
            
            user_data = {
                'access_token' : str(refresh.access_token),
                'refresh_token' : str(refresh),
                "id" : user.id,
                "username" : user.username,
                "email" : user.email,
                'is_admin': user.is_staff,
                'is_theatre_owner': user.is_theatre_owner,
                'is_approved': user.is_approved,
                'theatre_profile' : theatre_data
                
            }
            print(user_data , 'userdata')
            
            return Response({'message' : 'logined successfully' , 'user' : user_data} ,status=status.HTTP_200_OK)
    
        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt , name='dispatch')
class GoogleAuthView(View):
    permission_classes = [permissions.AllowAny]

    def post(self , request):
        try :
            data = json.loads(request.body) 
            email = data.get('email')
            print(data.get('username'))
            
            username = data.get('username') or email.split('@')[0]           
            user , created = User.objects.get_or_create(email=email,defaults={
                
                'username' : username,
                'password' : None, 
                
                }
            )
            if created :
                print('already exist')
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
                    'userEmail' : user.email,
                    'username' : user.username
                }
            })
        except Exception as e:
                print(str(e))
                return JsonResponse({'success': False, 'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
            
class editUser(APIView):
    permission_classes = [permissions.IsAuthenticated]
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
    
class checkUserType(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self , request ):
        data = request.data
        username = data.get('username')
        password = data.get('password')
        print(username , password)
        user = authenticate(request , username=username , password=password)
        if user is None :
            return Response({'error' : 'not a valid user'},status=status.HTTP_401_UNAUTHORIZED)
        user_type = None
        if user.is_staff :
            user_type = 'admin'
        elif user.is_approved and user.is_theatre_owner:
            user_type = 'theatre'
        else :
            user_type = 'user'
            
        print(user_type)
            
        return Response({'user_type' : user_type} , status=status.HTTP_200_OK)