from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Booking)
admin.site.register(BookingSeat)
admin.site.register(Payment)
admin.site.register(SeatLock)
admin.site.register(Notifications)
