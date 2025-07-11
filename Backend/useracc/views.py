from django.shortcuts import render
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import (
    UserSerializer,
    OtpVerificationSerializer,
    RegisterSerializers,
    UserEditSerializers,
)
from .models import User
from django.contrib.auth import authenticate
from django.core.validators import validate_email
import json
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login
from django.views import View
from rest_framework.decorators import api_view, permission_classes
from allauth.socialaccount.models import SocialAccount
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import (
    BlacklistedToken,
    OutstandingToken,
)
from theatre_owner.serializers import TheatreOwnerSerialzers
from theatre_owner.models import TheaterOwnerProfile
from django.core.exceptions import ValidationError
import logging

logger = logging.getLogger(__name__)


# user registration form request process to serializer
class UserRegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializers(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                logger.info(f"user is saved in cache memmory : {user}")
                return Response(
                    {"message": "user registered otp sended"},
                    status=status.HTTP_201_CREATED,
                )
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        logger.info(f"error from register serializer for user : {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# view for otp verification
class VerifyOtpView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OtpVerificationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user = User.objects.get(id=user.id)
            refresh = RefreshToken.for_user(user)

            user_data = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "user_type": "user",
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
            }

            print(user_data)
            return Response(
                {"user": user_data, "message": "OTP Verified Successfully "},
                status=status.HTTP_200_OK,
            )
        print(serializer.errors)
        return Response(
            {"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
        )


# user login view for multiple user type(theater , admin , normal user)
class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            username = data.get("username")
            password = data.get("password")
            user_type = data.get("user_type", "normal")
            user = authenticate(request, username=username, password=password)
            if user is None:
                return Response(
                    {"error": "invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            if user_type == "admin" and not user.is_staff:
                return Response({"error": "User is unautherized as Admin"})

            theatre_data = None
            if user_type == "theatre":

                if not user.is_theatre_owner and not user.is_approved:

                    return Response(
                        {"error": "User is not registered as a theatre owner"},
                        status=status.HTTP_403_FORBIDDEN,
                    )

                if not user.is_approved:
                    return Response(
                        {"error": "your theatre owner account is pending approval"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                try:
                    owner_data = TheaterOwnerProfile.objects.get(user=user)
                    serializer = TheatreOwnerSerialzers(instance=owner_data)
                    theatre_data = serializer.data

                except TheaterOwnerProfile.DoesNotExist:

                    return Response(
                        {"error": "Theatre owner profile not found"},
                        status=status.HTTP_404_NOT_FOUND,
                    )

            refresh = RefreshToken.for_user(user)

            user_data = {
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_admin": user.is_staff,
                "is_theatre_owner": user.is_theatre_owner,
                "is_approved": user.is_approved,
                "theatre_profile": theatre_data,
            }
            logger.info(user_data, "userdata")

            return Response(
                {"message": "logined successfully", "user": user_data},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class resetuser_password(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        identifier = data.get("identifier")
        new_password = data.get("password")

        if not identifier or not new_password:
            return Response(
                {"error": "fill all the fields"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            validate_email(identifier)
            is_email = True
        except ValidationError:
            is_email = False

        try:
            user = (
                User.objects.get(email=identifier)
                if is_email
                else User.objects.get(username=identifier)
            )

        except User.DoesNotExist:
            return Response(
                {"error": "user Does not exist"}, status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"message": "password changed successfully"}, status=status.HTTP_200_OK
        )


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            print(refresh_token)
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"detail": "Token blacklisted"}, status=status.HTTP_205_RESET_CONTENT
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name="dispatch")
class GoogleAuthView(View):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            data = json.loads(request.body)
            email = data.get("email")
            print(data.get("username"))

            username = data.get("username") or email.split("@")[0]
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": username,
                },
            )
            if created:
                print("already exist")
                user.set_password()
                SocialAccount.objects.create(
                    user=user, provider="google", uid=email, extra_data=data
                )
            else:
                user.username = username
                user.save()
            login(request, user, backend="django.contrib.auth.backends.ModelBackend")
            refresh = RefreshToken.for_user(user)

            return JsonResponse(
                {
                    "success": True,
                    "user": {
                        "access_token": str(refresh.access_token),
                        "refresh_token": str(refresh),
                        "id": user.id,
                        "userEmail": user.email,
                        "username": user.username,
                        "is_approved": user.is_approved,
                        "is_theatre_owner": user.is_theatre_owner,
                    },
                }
            )
        except Exception as e:
            print(str(e))
            return JsonResponse(
                {"success": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST
            )


class editUser(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, userId):
        try:
            user = User.objects.get(id=userId)

        except User.DoesNotExist:
            return Response(
                {"error": "user not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializers = UserEditSerializers(
            instance=user, data=request.data, partial=True
        )
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data, status=status.HTTP_200_OK)
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)


class checkUserType(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        username = data.get("username")
        password = data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response(
                {"error": "not a valid user"}, status=status.HTTP_401_UNAUTHORIZED
            )
        user_type = None
        if user.is_staff:
            user_type = "admin"
        elif user.is_approved and user.is_theatre_owner:
            user_type = "theatre"
        else:
            user_type = "user"
        print(user_type)

        return Response({"user_type": user_type}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def check_user_status(request, pk):
    try:
        user = User.objects.get(pk=pk)
        return Response(
            {
                "success": True,
                "is_blocked": getattr(user, "is_blocked", not user.is_active),
            }
        )
    except User.DoesNotExist:
        return Response({"success": False, "error": "User not found"}, status=404)
