from django.db import models
from datetime import datetime ,timedelta
from django.utils.timezone import timedelta

class Theatre(models.Model):
    owner = models.ForeignKey('theatre_owner.TheaterOwnerProfile' , on_delete=models.CASCADE , related_name='theatres' ,  null=True, blank=True)
    name = models.CharField(max_length=100)
    city =  models.ForeignKey('movies.City' , on_delete=models.CASCADE , related_name='theatres')
    address = models.TextField()
    # lat and lng coords for theatre
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    is_confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
     
    def has_screen(self):
        return self.screens.exists()
    
    def __str__(self):
        return f'{self.name} - {self.city.name}'
    
class Screen(models.Model) :
    theatre = models.ForeignKey(Theatre, on_delete=models.CASCADE , related_name='screens')
    screen_number = models.PositiveIntegerField()
    capacity = models.PositiveIntegerField(default=100)
    screen_type =  models.CharField(max_length=50 , null=True , blank=True )
    layout = models.ForeignKey('seats.SeatScreenLayout',on_delete=models.SET_NULL,null=True ,blank=True , related_name='screens')
    is_approved = models.BooleanField(default=False)
    def __str__(self) :
        return f"Screen {self.screen_number} - {self.theatre.name}"
   
class TimeSlot(models.Model):
    screen = models.ForeignKey(Screen , on_delete=models.CASCADE , related_name='time_slot')
    start_time = models.TimeField()
    
    def __str__(self ) :
        return f"screen  {self.screen.screen_number} - {self.start_time}"
    
class ShowTime(models.Model):
    screen = models.ForeignKey(Screen , on_delete=models.CASCADE , related_name='showtimes')
    movie = models.ForeignKey('movies.Movie' , on_delete=models.CASCADE , related_name='TimeSlotSlot')
    slots = models.ManyToManyField(TimeSlot , blank=True , through='ShowSlot')
    end_time = models.TimeField(blank=True , null=True)
    show_date = models.DateField(blank=True , null=True)
    end_date = models.DateField(blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    
   
    def __str__(self) :
        return f"{self.movie.title} at {self.screen.theatre.name} , Screeen {self.screen.screen_number} "
    
class ShowSlot(models.Model):
    showtime = models.ForeignKey(ShowTime , on_delete=models.CASCADE)
    slot = models.ForeignKey(TimeSlot , on_delete=models.CASCADE)
    
    class Meta:
        unique_together = ('showtime' , 'slot')
        