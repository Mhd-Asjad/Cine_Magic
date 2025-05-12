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
    # user_reaction = serializers.BooleanField(source='')
    class Meta:
        model = Post
        fields = ['id', 'author' , 'author_name' , 'title', 'reactions' , 'content', 'images', 'tags', 'like_count' , 'unlike_count' ,'created_at']

class EditPostSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )
    tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True, required=False
    )

    class Meta :
        model = Post
        fields = ['id' , 'title' , 'content' , 'images' ,'tags' ]
        
    def update(self, instance, validated_data):

        title = validated_data.get('title' , instance.title)
        content = validated_data.get('content' , instance.content)
        tags = validated_data.get('tags' , None)
        print(tags, 'tags in serializer')
        print(type(tags) , 'type of tags')
        if tags is not None and isinstance(tags, str):
            tags = json.loads(tags[0])
            print(tags , 'tags in serializer')
        instance.title = title
        instance.content = content
        print(tags , 'tags in serializer')
        if tags is not None :
            instance.tags.set(tags)
            
        instance.save()
        
        images = validated_data.get('images', None)
        print(images, 'images in serialize') 
        if images is not None and len(images) > 0:
            post_image = PostImage.objects.filter(post=instance).first()
            if post_image:
                post_image.image = images[0]
                post_image.save()
            else:
                PostImage.objects.create(post=instance, image=images[0])
        return instance
    
class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username' , read_only=True)
    class Meta :
        model = Comment
        fields = [ 'id' , 'user' , 'username' , 'post' , 'name' , 'created_at']