from django.shortcuts import render, redirect
from django.contrib.auth import authenticate , login,logout
from django.contrib import messages 

def login_user(request):
    return render(request,'login.html')