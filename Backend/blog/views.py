from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from django.shortcuts import get_object_or_404
from useracc.models import User
import json
# Create your views here.


class CreatePostView(APIView):
    def post(self , request , user_id):
            
        try :
            print(request.data)
            title = request.data.get('title')
            description = request.data.get('description')
            tags = request.data.get('tags',[])
            image = request.FILES.get('image')
            user = get_object_or_404(User , id = user_id)
            # print(image , tags , 'fasdfdlskajl')
            if not title :
                return Response({'error':'title is requiered*'},status=status.HTTP_400_BAD_REQUEST)
            if not description :
                return Response({'error':'description is requiered*'},status=status.HTTP_400_BAD_REQUEST)
            
            if Post.objects.filter(title=title).exists():
                return Response({
                    'error' : 'post already exist'
                },status=status.HTTP_400_BAD_REQUEST)
                
            
            print(tags)
            
            try:
                tags_list = json.loads(tags)
                if not isinstance(tags_list, list):
                    return Response(
                        {"error": "Tags must be an array"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except json.JSONDecodeError:
                return Response(
                    {"error": "Invalid tags format"},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            tags_ids = []
            
            for tag_name in tags :
                if not tag_name or not isinstance(tag_name , str):
                    continue
                
                tag , created =  Tag.objects.get_or_create(name = tag_name)
                tags_ids.append(tag.id)
            
            post = Post.objects.create(
                author = user,
                title = title ,
                content = description,
            )
            
            if tags_ids :
                post.tags.set(tags_ids)
                
            if image : 
                PostImage.objects.create(
                    post=post ,
                    image = image
                )
                
            return Response({"message": "Post created successfully", "post_id": post.id}, status=status.HTTP_201_CREATED)

        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                    
                
                            
            
        
        
        