from . import views
from django.urls import path

urlpatterns = [

    path('name/',views.login_user,name="name"),
]