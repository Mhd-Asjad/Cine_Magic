from django.db import models

# Create your models here.

class AdminSettings(models.Model):
    allow_registration = models.BooleanField(default=True)
    
    def __str__(self):
        status = 'open' if self.allow_registration else 'blocked'
        return f'theatre admission for new users are now {status}'