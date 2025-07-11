from rest_framework import serializers
from .models import *
import logging

logger = logging.getLogger(__name__)


class ReviewSerilizer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Rating
        fields = ["user", "username", "movie", "rating", "review", "created_at"]


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ["id", "question", "answer"]


class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaints
        fields = [
            "chat",
            "user",
            "category",
            "subject",
            "screen_shot",
            "description",
            "response_message",
            "status",
            "is_resolved",
            "created_at",
        ]


class ChatLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatLog
        fields = ["message", "reply"]


class ComplaintResponseSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username")
    screen_shot = serializers.SerializerMethodField()
    chat_details = ChatLogSerializer(source="chat", read_only=True)

    class Meta:
        model = Complaints
        fields = [
            "id",
            "user",
            "user_name",
            "subject",
            "description",
            "category",
            "status",
            "chat_details",
            "response_message",
            "is_resolved",
            "created_at",
            "screen_shot",
        ]

    def get_screen_shot(self, obj):
        request = self.context.get("request")
        if obj.screen_shot:
            return request.build_absolute_uri(obj.screen_shot.url)
        return None
