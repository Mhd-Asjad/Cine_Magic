from django.db import models
from useracc.models import User 

class TheaterOwnerProfile(models.Model) :
    user = models.OneToOneField(User , on_delete=models.CASCADE)
    theatre_name = models.CharField(max_length=100)
    location = models.CharField(max_length=100,null=True,blank=True)
    state  = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10 , null=True , blank=True)
    user_message = models.TextField(default=True)
    ownership_status = models.CharField( max_length=20 , choices=(('pending', 'Pending'), ('confirmed', 'Confirmed'), ('rejected', 'Rejected')), default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'{self.user.username} - {self.theatre_name}'