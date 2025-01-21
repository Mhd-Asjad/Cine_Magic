from django.contrib import admin
from .models import Movie , City
# Register your models here.

admin.site.register(Movie)


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'state','pincode') 
    search_fields = ('name', 'state')
    list_filter = ('state',) 