from django.db import models
from theatres.models import ShowTime
# Create your models here.

class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending' , 'Pending') ,
        ('payment_initiated' , 'payment Initiated'),
        ('confirmed' , 'Confirmed'),
        ('cancelled' , 'Cancelled')
    )
    
    booking_id = models.CharField(max_length=20 , unique=True )
    user = models.ForeignKey('useracc.User' , on_delete=models.CASCADE , null=True , blank=True)
    show = models.ForeignKey(ShowTime , on_delete=models.CASCADE)
    seats = models.ManyToManyField('seats.seats', related_name='bookingseats')
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    booking_time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20 , choices=STATUS_CHOICES , default='pending')
    payment_id = models.CharField(max_length=100 , null=True , blank=True)
    amount = models.DecimalField(max_digits=10 , decimal_places=2 )
    
    def __str__(self):
        return self.booking_id
    
    def save(self , *args , **kwargs ):
        if not self.booking_id :
            import random
            import string
            from datetime import datetime
            
            date_str = datetime.now().strftime('%Y%m%d')
            random_str = ''.join(random.choice(string.ascii_uppercase + string.digits , k=4))
            self.booking_id = f'MOV-{date_str}-{random_str}'
            
        super().save(*args , **kwargs)
        
        
class BookingSeat(models.Model) :
    booking = models.ForeignKey(Booking , on_delete=models.CASCADE , related_name='bookingseats')
    seat = models.ForeignKey('seats.seats', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    
    class Meta : 
        unique_together = ('booking' , 'seat')
        
class SeatLock(models.Model) :
    seat = models.ForeignKey('seats.seats' , on_delete=models.CASCADE)
    show = models.ForeignKey('theatres.ShowTime' , on_delete=models.CASCADE)
    user = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    def is_expired(self ):
        from django.utils import timezone
        return timezone.now() > self.expires_at
