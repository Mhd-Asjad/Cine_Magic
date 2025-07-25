from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from .models import *
from django.shortcuts import get_object_or_404
from useracc.models import User
import json
from .serializers import *
from rest_framework.pagination import PageNumberPagination
import logging

# Create your views here.

logger = logging.getLogger(__name__)

class CustomPagination(PageNumberPagination):
    page_size = 5
    page_query_param = "page"

# create user post
class CreatePostView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, user_id):

        try:
            title = request.data.get("title")

            description = request.data.get("description")
            tags = request.data.get("tags")
            image = request.FILES.get("image")
            user = get_object_or_404(User, id=user_id)
            if not title:
                return Response(
                    {"error": "title is requiered*"}, status=status.HTTP_400_BAD_REQUEST
                )
            if not description:
                return Response(
                    {"error": "description is requiered*"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if Post.objects.filter(title=title).exists():
                return Response(
                    {"error": "post already exist"}, status=status.HTTP_400_BAD_REQUEST
                )

            try:
                tag_list = json.loads(tags)

                if not isinstance(tag_list, list):
                    return Response(
                        {"error": "Tags must be an array"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except json.JSONDecodeError:
                return Response(
                    {"error": "Invalid tags format"}, status=status.HTTP_400_BAD_REQUEST
                )

            tags_ids = []
            for tag_name in tag_list:
                if not tag_name or not isinstance(tag_name, str):
                    continue
                tag, created = Tag.objects.get_or_create(name=tag_name)
                tags_ids.append(tag.id)

            post = Post.objects.create(
                author=user,
                title=title,
                content=description,
            )

            if tags_ids:
                post.tags.set(tags_ids)

            if image:
                PostImage.objects.create(post=post, image=image)

            return Response(
                {"message": "Post created successfully", "post_id": post.id},
                status=status.HTTP_201_CREATED,
            )

        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# get user posts
class GetUserPostsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    # This view retrieves all posts made by a specific user.
    def get(self, request, user_id):
        try:
            user = get_object_or_404(User, id=user_id)
        except User.DoesNotExist:
            return Response({"error": "user Does not exist"})
        try:
            posts = Post.objects.filter(author=user)
            if not posts.exists():
                return Response({"message": "no posts found"})

            serializer = PostSerializer(posts, many=True, context={"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# This view allows a user to edit an existing post.
class EditPost(APIView):
    permission_classes = [permissions.IsAuthenticated]
    # This view allows a user to edit an existing post.
    def put(self, request, post_id):

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response(
                {"error": "Post does not exist"}, status=status.HTTP_404_NOT_FOUND
            )

        data = request.data
        tags = json.loads(data.get("tags"))

        if not isinstance(tags, list):
            raise TypeError("value not a list")

        tag_ids = []
        errors = []
        for tag_name in tags:
            try:
                tag, created = Tag.objects.get_or_create(name=tag_name)
                tag_ids.append(tag.id)

            except Tag.DoesNotExist:
                errors.append(f"Tag {tag_name} Does not Exist")
        if errors:
            return Response({"error": errors}, status=status.HTTP_400_BAD_REQUEST)

        form_data = request.data.copy()
        form_data.pop("tags", None)
        if request.FILES:
            logger.info("request files are here:", request.FILES)
            form_data["image"] = request.FILES.get("image")
        form_data.setlist("tags", tag_ids)

        serializer = EditPostSerializer(instance=post, data=form_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# This view allows a user to delete an existing post.
class DeletePost(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
            post.delete()
            return Response(
                {"message": "Post deleted successfully"},
                status=status.HTTP_204_NO_CONTENT,
            )
        except Post.DoesNotExist:
            return Response(
                {"error": "Post does not exist"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

# get all posts
class GetAllPosts(generics.ListAPIView):
    queryset = Post.objects.all()
    permission_classes = [permissions.AllowAny]
    pagination_class = CustomPagination
    serializer_class = PostSerializer
    # This view retrieves all posts with pagination.
    def list(self, request):
        queryset = self.get_queryset()
        paginated_queryset = self.paginate_queryset(queryset)
        serializer = PostSerializer(
            paginated_queryset, many=True, context={"request": request}
        )
        return self.get_paginated_response(serializer.data)


# get particular post detailsss
class GetPostDetail(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, id):
        try:
            post = Post.objects.get(id=id)

        except Post.DoesNotExist:
            return Response({"error": "post does not exist"}, status=status.HTTP_200_OK)

        serializer = PostSerializer(post, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

# This view allows a user to post a comment on a specific post.
class PostComment(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "comment posted"}, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)

        except Post.DoesNotExist:
            return Response(
                {"error": "post not found"}, status=status.HTTP_400_BAD_REQUEST
            )

        data = post.comments.all()
        serializer = CommentSerializer(data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# This view allows a user to toggle the like on blog posts.
class toggle_like(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, post_id):
        user = request.user
        try:
            post = Post.objects.get(id=post_id)

        except Post.DoesNotExist:
            return Response(
                {"error": "post not found"}, status=status.HTTP_400_BAD_REQUEST
            )

        reaction, created = PostReaction.objects.get_or_create(user=user, post=post)

        if reaction.is_like == True:
            reaction.is_like = None
            post.like_count -= 1

        else:
            if reaction.is_like == False:
                post.unlike_count -= 1

            reaction.is_like = True
            post.like_count += 1
        reaction.save()
        post.save()

        return Response({"message": "post liked"}, status=status.HTTP_200_OK)

# This view allows a user to toggle the dislike on blog posts.
class toggle_dislike(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, post_id):
        user = request.user
        try:
            post = Post.objects.get(id=post_id)

        except Post.DoesNotExist:
            return Response(
                {"error": "post not found"}, status=status.HTTP_400_BAD_REQUEST
            )

        reaction, created = PostReaction.objects.get_or_create(user=user, post=post)

        if reaction.is_like == False:
            reaction.is_like = None
            post.unlike_count -= 1

        else:
            if reaction.is_like == True:
                post.like_count -= 1
            reaction.is_like = False
            post.unlike_count += 1

        reaction.save()
        post.save()

        return Response({"message": "post disliked"}, status=status.HTTP_200_OK)

#  this view allows a user to get their reaction on a post.
class get_post_reaction(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, post_id):
        user = request.user

        try:
            post_reaction = PostReaction.objects.get(user=user, post=post_id)
            return Response(
                {"is_like": post_reaction.is_like}, status=status.HTTP_200_OK
            )
        except PostReaction.DoesNotExist:
            return Response({"error": None}, status=status.HTTP_404_NOT_FOUND)

# This view allows a user to edit or delete their comment on a post.
class edit_comment(APIView):
    permission_classes = [permissions.IsAuthenticated]
    # This view allows a user to edit or delete their comment on a post.
    def put(self, request, comment_id):
        data = request.data
        try:
            comment = Comment.objects.get(id=comment_id)
        except Comment.DoesNotExist:
            return Response(
                {"error": "comment is not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = CommentSerializer(instance=comment, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    # This view allows a user to delete their comment on a post.
    def delete(self, request, comment_id):
        try:
            comment = Comment.objects.get(id=comment_id)
        except Comment.DoesNotExist:
            return Response(
                {"error": "comment is not found"}, status=status.HTTP_404_NOT_FOUND
            )

        comment.delete()
        return Response(
            {"message": "comment deleted successfully"}, status=status.HTTP_200_OK
        )
