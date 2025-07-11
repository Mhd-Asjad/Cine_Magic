from rest_framework import serializers
from .models import User
import re
import random
from django.core.mail import send_mail
from django.core.cache import cache
import datetime


class RegisterSerializers(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def validate(self, attrs):
        if User.objects.filter(username=attrs["username"]).exists():
            raise serializers.ValidationError(
                {"username": "This username is already taken."}
            )
        if User.objects.filter(email=attrs["email"]).exists():
            raise serializers.ValidationError(
                {"email": "This email is already registered."}
            )
        return attrs

    def create(self, validated_data):
        otp = str(random.randint(100000, 999999))
        expire_at = datetime.datetime.now() + datetime.timedelta(minutes=2)

        print(otp, "new otp found")
        cache.set(
            f"otp_{validated_data['email']}",
            {
                "otp": otp,
                "username": validated_data["username"],
                "email": validated_data["email"],
                "password": validated_data["password"],
            },
            timeout=120,
        )

        send_mail(
            "Your OTP for Registration",
            f"Your OTP is: {otp}",
            "mhdasjad877@gmail.com",
            [validated_data["email"]],
            fail_silently=False,
        )
        return {"message": "OTP sent to your email.", "expireAt": expire_at}


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "otp", "is_active"]

    def validate_number(self, data):
        if User.objects.filter(username=data).exists():
            raise serializers.ValidationError("username already registered.")
        return data

    def create(self, validate_data):
        user = User.objects.create(**validate_data)
        return user


class OtpVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):

        cached_data = cache.get(f"otp_{data['email']}")
        print(cached_data)
        if not cached_data:
            raise serializers.ValidationError({"error": "OTP is expired.....! "})

        if cached_data["otp"] != data["otp"]:
            raise serializers.ValidationError({"error": "*Invalid otp"})

        return data

    def create(self, validated_data):
        cached_data = cache.get(f"otp_{validated_data['email']}")
        user = User.objects.create(
            username=cached_data["username"],
            email=cached_data["email"],
        )
        user.set_password(cached_data["password"])
        cache.delete(f"otp_{validated_data['email']}")
        user.save()
        return user


class UserEditSerializers(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email"]


class TheatreOwnerSerializer(serializers.ModelSerializer):
    pass
