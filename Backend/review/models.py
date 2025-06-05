from django.db import models
from useracc.models import User
from movies.models import Movie
from booking.models import Booking
from django.utils import timezone
# Create your models here.

class Rating(models.Model):
    user = models.ForeignKey(User , on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie , on_delete=models.CASCADE)
    booking = models.ForeignKey(Booking , on_delete=models.CASCADE ,related_name='ratings')
    rating = models.FloatField()
    review = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user' , 'movie')
        
    def __str__(self):
        return f"{self.user.username} rated {self.movie.title} - {self.rating}⭐"


class ChatLog(models.Model):
    user = models.ForeignKey(User , on_delete=models.CASCADE)
    message = models.TextField()
    reply = models.TextField(null=True , blank=True)
    is_bot = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self) :
        value = self.reply if self.is_bot else self.message
        role = 'bot' if self.is_bot else 'user' 
        return f'{role} - {value} ({self.user.username}) '
    
class Complaints(models.Model):
    CATEGORY_CHOICES = [
        ('booking', 'Booking Issue'),
        ('payment', 'Payment Issue'),
        ('technical', 'Technical Problem'),
        ('general', 'General Feedback'),
    ]

    STATUS_CHOICES = [
        
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    user = models.ForeignKey(User , on_delete=models.CASCADE)
    chat = models.ForeignKey(ChatLog , on_delete=models.CASCADE , related_name='complaints')
    category = models.CharField(max_length=100 ,choices=CATEGORY_CHOICES )
    subject = models.CharField(max_length=255)
    screen_shot = models.ImageField(upload_to='complaints/' , blank=True , null=True)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    response_message = models.TextField(blank=True , null=True)
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"complaint by {self.user.username} - {self.category}"

class FAQ(models.Model):
    question = models.CharField(max_length=255)
    answer = models.TextField()
    
    def __str__(self) :
        return f'{self.question[:10]}...?'
    
