from rest_framework import serializers
from .models import *


class ReviewSerilizer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username' , read_only=True)
    class Meta : 
        model = Rating
        fields = ['user' , 'username' , 'movie' , 'rating' , 'review' , 'created_at']
        
class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer']