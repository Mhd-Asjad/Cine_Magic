from .views import * 
from django.urls import path
# from rest_framework

urlpatterns = [
    path('register/',UserRegisterView.as_view() , name='register'),
    path('verify_otp/' , VerifyOtpView.as_view(), name="verify_otp"),
    path('userlogin/', UserLoginView.as_view() , name="userlogin"),
    path('google-auth/',GoogleAuthView.as_view(),name='google-auth')
]