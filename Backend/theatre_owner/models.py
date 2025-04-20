from django.db import models
from useracc.models import User 

class TheaterOwnerProfile(models.Model) :
    user = models.OneToOneField(User , on_delete=models.CASCADE)
    owner_photo = models.ImageField(upload_to='owner_photos' , null=True , blank=True)
    latitude = models.DecimalField(max_digits=22 , decimal_places=15 ,blank=True , null=True)
    longitude = models.DecimalField(max_digits=22 , decimal_places=15 , blank=True , null=True)
    theatre_name = models.CharField(max_length=100)
    location = models.CharField(max_length=100,null=True,blank=True )
    state  = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10 , null=True , blank=True)
    user_message = models.TextField(default=True)
    ownership_status = models.CharField( max_length=20 , choices=(('pending', 'Pending'), ('confirmed', 'Confirmed'), ('rejected', 'Rejected')), default='pending')
    created_at = models.DateTimeField(auto_now_add=True) 
    
    def __str__(self):
        return f'{self.user.username} - {self.theatre_name}'