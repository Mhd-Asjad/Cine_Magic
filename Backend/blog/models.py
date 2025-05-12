from django.db import models
from useracc.models import User

class Tag(models.Model):
    name = models.CharField(max_length=100 , unique=True)
    
    def __str__(self):
        return self.name
        
class Post(models.Model):
    author = models.ForeignKey(User , on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    like_count = models.IntegerField(default=0)
    unlike_count = models.IntegerField(default=0)
    tags = models.ManyToManyField(Tag, related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'{self.author.username} {self.id} - {self.title}.....'

    
class PostImage(models.Model) :
    post = models.ForeignKey(Post , on_delete=models.CASCADE , related_name='images')
    image = models.ImageField(upload_to='post_images/',null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Comment(models.Model):
    user = models.ForeignKey(User , on_delete=models.CASCADE )
    post = models.ForeignKey(Post , on_delete=models.CASCADE , related_name='comments')
    name = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.post.title} - {self.user.username}'
    
    
class PostReaction(models.Model):
    user = models.ForeignKey(User , on_delete=models.CASCADE)
    post = models.ForeignKey(Post , on_delete=models.CASCADE , related_name='reactions')
    is_like = models.BooleanField(null=True)
    
    def __str__(self):
        return f'{self.user.username} - {self.post.title}'