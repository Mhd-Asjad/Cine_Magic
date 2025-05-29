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
        
    def can_review(self):
        return timezone.now() > self.booking.show.end_time

    def __str__(self):
        return f"{self.user.username} rated {self.movie.title} - {self.rating}⭐"
    
    
    