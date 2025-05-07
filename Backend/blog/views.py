from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,permissions
from .models import *
from django.shortcuts import get_object_or_404
from useracc.models import User
import json
from .serializers import *
# Create your views here.


class CreatePostView(APIView):
    # permission_classes = [permissions.IsAuthenticated]
    def post(self , request , user_id):
            
        try :
            title = request.data.get('title')

            description = request.data.get('description')
            tags = request.data.get('tags')
            image = request.FILES.get('image')
            user = get_object_or_404(User , id = user_id)
            if not title :
                return Response({'error':'title is requiered*'},status=status.HTTP_400_BAD_REQUEST)
            if not description :
                return Response({'error':'description is requiered*'},status=status.HTTP_400_BAD_REQUEST)
            
            if Post.objects.filter(title=title).exists():
                return Response({
                    'error' : 'post already exist'
                },status=status.HTTP_400_BAD_REQUEST)
                

            
            try:
                tag_list = json.loads(tags)
                
                if not isinstance(tag_list, list):
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
            for tag_name in tag_list :
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
                    
class GetUserPostsView(APIView):
    # permission_classes = [permissions.IsAuthenticated]
    

    def get(self , request , user_id ):
        try :
            user = get_object_or_404(User , id = user_id)
        except User.DoesNotExist:
            return Response({'error' : 'user Does not exist'}) 
        try:    
            posts = Post.objects.filter(author = user)
            if not posts.exists():
                return Response({'message': 'no posts found'})
            
            serializer = PostSerializer(posts , many=True , context={'request':request})
            print(serializer.data)
            return Response(serializer.data , status=status.HTTP_200_OK)
        
        except Exception as e :
            return Response({'error' : str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class EditPost(APIView):
    def put(self , request , post_id):
        data = request.data
        tags = json.loads(data.get('tags'))
        print(data , ' vieww')
        
        if not isinstance(tags, list):
            raise TypeError('value not a list')
        
        tag_ids = []
        errors = []
        for tag_name in tags :
            print(tag_name)
            try :
                tag , created =  Tag.objects.get_or_create(name = tag_name)
                tag_ids.append(tag.id)
                
            except Tag.DoesNotExist:
                errors.append(f'Tag {tag_name} Does not Exist')
        if errors : 
            return Response({'error':errors },status=status.HTTP_400_BAD_REQUEST)
        
        data = request.data.copy()
        data.pop('tags')
        print(data)
        data.setlist('tags' , tag_ids)
        print('final data' , data)
  
        try :
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist :
            return Response({'error':'post does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = EditPostSerializer(instance=post , data = data , partial = True)
        
        if serializer.is_valid() :
            serializer.save()
            return Response(serializer.data , status=status.HTTP_200_OK)
        print(serializer.errors)
        return Response(serializer.errors , status=status.HTTP_400_BAD_REQUEST)