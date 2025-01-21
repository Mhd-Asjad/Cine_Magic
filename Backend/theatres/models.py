from django.db import models

class Theatre(models.Model):
    name = models.CharField(max_length=100)
    city =  models.ForeignKey('movies.City' , on_delete=models.CASCADE , related_name='theatres')
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f'{self.name} - {self.city.name}'
    
class Screen(models.Model) :
    theatre = models.ForeignKey(Theatre, on_delete=models.CASCADE , related_name='screens')
    screen_number = models.PositiveIntegerField()
    capacity = models.PositiveIntegerField(default=100)
    screen_type =  models.CharField(max_length=50 , null=True , blank=True )

    def __str__(self) :
        return f"Screen {self.screen_number} - {self.theatre.name}"

class ShowTime(models.Model) :
    screen = models.ForeignKey(Screen , on_delete=models.CASCADE , related_name='showtimes' )
    movie = models.ForeignKey('movies.Movie' , on_delete=models.CASCADE , related_name='showtimes')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self) :
        return f"{self.movie.title} on {self.screen.theatre.name} , Screeen {self.screen.screen_number} at {self.start_time.strftime('%Y-%m-%d %H:%M')}"


