from .views import * 
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView ,
    TokenRefreshView
)

urlpatterns = [
    path('token/',TokenObtainPairView.as_view(),name="token_obtain_pair"),
    path('token/refresh/', TokenRefreshView.as_view(),name='token_refresh'),
    path('register/',UserRegisterView.as_view() , name='register'),
    path('verify_otp/' , VerifyOtpView.as_view(), name="verify_otp"),
    path('userlogin/', UserLoginView.as_view() , name="userlogin"),
    path('userlogout/',LogoutView.as_view(),name='user-logout'),
    path('edit-user/<int:userId>/' , editUser.as_view() , name='edit-user'),
    path('google-auth/',GoogleAuthView.as_view(),name='google-auth'),
    path('get-usertype/', checkUserType.as_view(), name='get-usertype'),
    path('reset-password/',resetuser_password.as_view(),name='reset-password')
]