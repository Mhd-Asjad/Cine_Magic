from django.db import models
from datetime import datetime

class City(models.Model) :
    name = models.CharField(max_length=100 , unique=True)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10 , blank=True , null=True)
    def __str__(self):
        return f'{self.name} - {self.state}'
    
class Movie(models.Model) :
    title = models.CharField(max_length=100)
    language = models.CharField(max_length=50)
    duration = models.IntegerField()
    release_date = models.DateField()
    description = models.TextField()
    genre = models.CharField(max_length=50)
    poster = models.ImageField(max_length=500, blank=True , null= True , upload_to='posters/')
    created_at = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return self.title