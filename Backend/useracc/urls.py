from .views import * 
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView ,
    TokenRefreshView
)

# from rest_framework


urlpatterns = [
    path('token/',TokenObtainPairView.as_view(),name="token_obtain_pair"),
    path('token/refresh/', TokenRefreshView.as_view(),name='token_refresh'),
    path('register/',UserRegisterView.as_view() , name='register'),
    path('verify_otp/' , VerifyOtpView.as_view(), name="verify_otp"),
    path('userlogin/', UserLoginView.as_view() , name="userlogin"),
    path('edit-user/<int:userId>/' , editUser.as_view() , name='edit-user'),
    path('google-auth/',GoogleAuthView.as_view(),name='google-auth')
]