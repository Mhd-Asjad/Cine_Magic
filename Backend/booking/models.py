from django.db import models
from theatres.models import *
import qrcode
import io
from django.core.files.base import ContentFile
import logging

logger = logging.getLogger(__name__)
class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending' , 'Pending') ,
        ('payment_initiated' , 'payment Initiated'),
        ('confirmed' , 'Confirmed'),
        ('cancelled' , 'Cancelled')
    )
    
    REFUND_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('not_applicable', 'Not Applicable'),
    )
    
    booking_id = models.CharField(max_length=20 , unique=True )
    qr_code = models.ImageField(upload_to='qrcodes/' , blank=True , null=True)
    user = models.ForeignKey('useracc.User' , on_delete=models.CASCADE , null=True , blank=True , related_name='booking')
    show = models.ForeignKey(ShowTime , on_delete=models.CASCADE,blank=True , null=True)
    slot = models.ForeignKey(TimeSlot , on_delete=models.CASCADE , blank=True , null=True)
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    booking_time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20 , choices=STATUS_CHOICES , default='pending')
    payment_id = models.CharField(max_length=100 , null=True , blank=True)
    amount = models.DecimalField(max_digits=10 , decimal_places=2)
    
    cancelled_at = models.DateField(null=True , blank=True)
    refund_amount = models.DecimalField(max_digits=10 , decimal_places=2 ,null=True , blank=True)
    refunt_status = models.CharField(max_length=20 , choices=REFUND_STATUS_CHOICES , default='not-applicable' )
    def generate_qrcode(self) :
        if self.status == 'confirmed' and not self.qr_code :
            qr_data = f'http://127.0.0.1:8000/booking/ticket/{self.id}/'
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.ERROR_CORRECT_L,
                box_size=10,
                border=4
            )
            qr.add_data(qr_data)
            qr.make(fit=True)
            img = qr.make_image(fill_color='black' , back_color='white')
            
            buffer = io.BytesIO()
            img.save(buffer , format="PNG")
            buffer.seek(0)
            
            file_name = f"qr-{self.booking_id}.png"
            self.qr_code.save(file_name , ContentFile(buffer.read()),save=False)
            return True
        
        return False
    
    
    def save(self , *args , **kwargs ):
        if not self.booking_id :
            import random
            import string
            from datetime import datetime
            
            date_str = datetime.now().strftime('%Y%m%d')[::-1]
            random_str = ''.join(random.choices(string.ascii_uppercase + string.digits , k=4))
            self.booking_id = f'MOV-{date_str}-{random_str}'
            
        super().save(*args , **kwargs)
        
    def __str__(self):
        id = str(self.id)
        return f'{id} - {self.status} - {self.booking_time}'

    # if created or instance.status == 'confirmed' :
    #     logger.info(f"Sending group message to {group_name}" )
    #     async_to_sync(channel_layer.group_send)(
    #         group_name,
    #         {
    #             'type': 'send_notification',
    #             'event_type': 'booking_confirmed',
    #             'message': f'your booking {instance.booking_id} is confirmed!'
    #         }        
    #     )
    # elif instance.status == 'cancelled' :
    #     async_to_sync(channel_layer.group_send)(
    #         group_name,
    #         {
    #             'type': 'send_notification',
    #             'event_type': 'booking_cancelled',
    #             'message': f'Your booking {instance.booking_id} has been cancelled.'
    #         }
    #     )
    
class BookingSeat(models.Model) :

    SEAT_STATUS_CHOISES = (
        ('booked' , 'Booked'),
        ('cancelled' , 'Cancelled'),
    )
    booking = models.ForeignKey(Booking , on_delete=models.CASCADE , related_name='bookingseats')   
    seat = models.ForeignKey('seats.seats', on_delete=models.CASCADE)
    status = models.CharField(max_length=20,choices=SEAT_STATUS_CHOISES , default='booked')
    price = models.DecimalField(max_digits=8, decimal_places=2)
    
    class Meta : 
        unique_together = ('booking' , 'seat')
    
    def __str__(self) :
        return f'{self.seat} - {self.status} - {self.booking.booking_time}'
        
class Payment(models.Model):
    booking  =  models.OneToOneField(Booking , on_delete=models.CASCADE,related_name='payment')
    order_id = models.CharField(max_length=100)
    payer_id = models.CharField(max_length=100)
    payment_method = models.CharField(default='paypal' , max_length=50)
    amount = models.DecimalField(max_digits=10 , decimal_places=2)
    currency = models.CharField(max_length=4 , default='USD')
    payment_date = models.DateTimeField(auto_now_add=True)
    capture_id = models.CharField(max_length=100 , null=True , blank=True)
    
class SeatLock(models.Model) :
    seat = models.ForeignKey('seats.seats' , on_delete=models.CASCADE)
    show = models.ForeignKey('theatres.ShowTime' , on_delete=models.CASCADE)
    user = models.CharField(max_length=100) 
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
      
    def is_expired(self ):
        from django.utils import timezone
        return timezone.now() > self.expires_at

class Notifications(models.Model):
    NOTIFICATION_TYPES = (
        ('Booking' , 'booking'),
        ('Cancelled' , 'cancelled'),
        ('Complaint' , 'complaint')
    )
    user = models.ForeignKey('useracc.User', on_delete=models.CASCADE , related_name='notifications')
    notification_type = models.CharField(max_length=20 , choices=NOTIFICATION_TYPES)
    message = models.TextField()
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE , null=True , blank=True)
    complaint = models.ForeignKey('review.Complaints' , on_delete=models.CASCADE , null=True , blank=True)
    is_read = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    
    
    class Meta:
        unique_together = ('user' , 'booking' , 'notification_type')
    
    def __str__(self):
        return  f'{self.user.username} notification for {self.notification_type}'
    
    