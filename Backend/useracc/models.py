from django.db import models
from django.contrib.auth.models import AbstractBaseUser , BaseUserManager , PermissionsMixin
# Create your models here.

class CustomUserManager(BaseUserManager):
    def create_user(self , username , email ,  password=None , **extra_fields) :
        if not username :
            raise ValueError('The username must be set')
        
        user = self.model(username=username , email = email ,  **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self , username , email , password=None , **extra_fields):
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_superuser',True)
        return self.create_user(username , email , password , **extra_fields)

class User(AbstractBaseUser,PermissionsMixin):
    
    username = models.CharField(max_length=225 , unique=True)
    email = models.EmailField(unique=True ,blank=True , null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_theatre_owner = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']
    
    objects = CustomUserManager()

    def __str__(self):
        return self.username