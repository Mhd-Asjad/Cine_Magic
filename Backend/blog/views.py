from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status,permissions , generics
from .models import *
from django.shortcuts import get_object_or_404
from useracc.models import User
import json
from .serializers import *
from rest_framework.pagination import PageNumberPagination
# Create your views here.

class CustomPagination(PageNumberPagination):
    page_size=4
    page_query_param = 'page'

class CreatePostView(APIView):
    permission_classes = [permissions.IsAuthenticated]
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
    permission_classes = [permissions.IsAuthenticated]

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
            print(serializer.data , 'serializer data')
            return Response(serializer.data , status=status.HTTP_200_OK)
        
        except Exception as e :
            return Response({'error' : str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class EditPost(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def put(self , request , post_id):
        print(request.data , 'request data')
        print(post_id)
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({'error': 'Post does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data
        tags = json.loads(data.get('tags'))

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
        
        form_data = request.data.copy()
        form_data.pop('tags', None)
        if request.FILES:
            print(request.FILES.get('image'))
            form_data['image'] = request.FILES.get('image')
        form_data.setlist('tags', tag_ids)
        print('tag type is here:',type(form_data.get('tags')))
        
        serializer = EditPostSerializer(instance=post , data = form_data , partial = True)
        if serializer.is_valid() :
            serializer.save()
            return Response(serializer.data , status=status.HTTP_200_OK)
        print(serializer.errors)
        print(serializer.data)
        return Response(serializer.errors , status=status.HTTP_400_BAD_REQUEST)
    
class DeletePost(APIView):
    permission_classes = [permissions.AllowAny]
    def delete(self , request , post_id):
        try:
            post = Post.objects.get(id=post_id)
            post.delete()
            return Response({'message': 'Post deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Post.DoesNotExist:
            return Response({'error': 'Post does not exist'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class GetAllPosts(generics.ListAPIView):
    queryset = Post.objects.all()
    permission_classes = [permissions.AllowAny]
    pagination_class = CustomPagination
    serializer_class = PostSerializer
    def list(self , request):
        print(request.user)
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = PostSerializer(paginated_queryset , many=True , context={'request':request})
        return self.get_paginated_response(serializer.data)

# get particular post detailsss
class GetPostDetail(APIView):
    def get(self , request , id):
        try :
            post = Post.objects.get(id=id)
            
        except Post.DoesNotExist:
            return Response({
                'error' : 'post does not exist'
            },status=status.HTTP_200_OK)
            
        serializer = PostSerializer(post , context={'request':request} )
        return Response(serializer.data ,status=status.HTTP_200_OK )
    
class PostComment(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self , request , post_id):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'comment posted'},status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    
    def get(self , request , post_id):
        try:
            post = Post.objects.get(id=post_id)
            
        except Post.DoesNotExist :
            return Response({'error' : 'post not found'},status=status.HTTP_400_BAD_REQUEST)
        
        data = post.comments.all()
        serializer = CommentSerializer(data , many=True)
        return Response(serializer.data , status=status.HTTP_200_OK)

class toggle_like(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self , request , post_id ):
        user = request.user
        try:
            post = Post.objects.get(id=post_id)
        
            
        except Post.DoesNotExist :
            return Response({'error' : 'post not found'},status=status.HTTP_400_BAD_REQUEST)

        reaction , created = PostReaction.objects.get_or_create(user=user , post=post)
        
        if reaction.is_like == True :
            reaction.is_like = None
            post.like_count -= 1
            
        else :
            if reaction.is_like == False :
                post.unlike_count -= 1
                
            reaction.is_like = True
            post.like_count += 1 
        reaction.save()
        post.save()
        
        return Response({'message' : 'post liked' },status=status.HTTP_200_OK)
    
class toggle_dislike(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self , request , post_id ):
        user = request.user
        try:
            post = Post.objects.get(id=post_id)
        
            
        except Post.DoesNotExist :
            return Response({'error' : 'post not found'},status=status.HTTP_400_BAD_REQUEST)
    
        reaction , created = PostReaction.objects.get_or_create(user=user , post=post)
    
        if reaction.is_like == False :
            reaction.is_like = None
            post.unlike_count -= 1
            
        else :
            if reaction.is_like == True:
                post.like_count -= 1
            reaction.is_like = False
            post.unlike_count += 1
        
        reaction.save()
        post.save()
            
        return Response({'message':'post disliked'} ,status=status.HTTP_200_OK)

class get_post_reaction(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self , request , post_id):
        user =  request.user
        
        try:
            post_reaction = PostReaction.objects.get(user=user,post=post_id)
            print(post_reaction.user.username)
            print(post_reaction.is_like)
            return Response({'is_like' : post_reaction.is_like},status=status.HTTP_200_OK)
        except PostReaction.DoesNotExist:
            return Response({'error' : None},status=status.HTTP_404_NOT_FOUND)
        