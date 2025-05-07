from rest_framework import serializers , status
from .models import *
import json
import traceback
from rest_framework.response import Response
class PostImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta :
        model = PostImage
        fields = ['image']
        
    def get_image(self , obj):
        request = self.context.get('request')
        if obj.image :
            return request.build_absolute_uri(obj.image.url)
        return None
    
class PostSerializer(serializers.ModelSerializer):
    images = PostImageSerializer(many=True , read_only=True)
    tags = serializers.StringRelatedField(many=True)
    author_name = serializers.CharField(source='author.username' , read_only=True)
    class Meta:
        model = Post
        fields = ['id', 'author' , 'author_name' , 'title', 'content', 'images', 'tags' , 'created_at']

class EditPostSerializer(serializers.ModelSerializer):
    class Meta :
        model = Post
        fields = ['id' , 'title' , 'content' , 'images' , 'tags']
