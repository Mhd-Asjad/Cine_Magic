from rest_framework import serializers
from useracc.models import User
from movies.models import City, Movie
from theatres.models import *
from theatre_owner.models import *
from useracc.models import User
from seats.models import seats
from .models import *
from django.db.models.functions import Concat


class Userserialzer(serializers.ModelSerializer):
    class Meta:
        model = User
        fileds = "__all__"


class CitySerializers(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ["name", "state", "pincode"]

    def validate_pincode(self, data):
        if len(data) != 6:
            raise serializers.ValidationError("pincode must be a valid format")

        return data

    def create(self, validated_data):
        print(validated_data)
        city = City.objects.create(**validated_data)
        print(f"created Cities are : {city.name} - {city.state}")
        return city


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ["name", "state", "pincode"]


class TheatreOwnerSerialzers(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username")

    class Meta:
        model = TheaterOwnerProfile
        fields = [
            "id",
            "user_name",
            "theatre_name",
            "location",
            "state",
            "pincode",
            "ownership_status",
        ]


class ShowTimeSerializer(serializers.ModelSerializer):
    start_time = serializers.CharField(source="slot.start_time")
    movie = serializers.CharField(source="movie.title")

    class Meta:
        model = ShowTime
        fields = ["movie", "start_time", "end_time"]


class SeatSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()

    class Meta:
        model = seats
        fields = [
            "id",
            "screen",
            "row",
            "number",
            "category",
            "is_active",
            "is_seat",
            "label",
        ]

    def get_label(self, obj):
        if obj.is_seat:
            return f"{obj.row}{obj.number}"
        return ""


class ScreenSerializer(serializers.ModelSerializer):
    # showtimes = ShowTimeSerializer(many=True)
    seats = SeatSerializer(many=True, read_only=True)
    seat_in_a_row = serializers.CharField(source="layout.cols", read_only=True)

    class Meta:
        model = Screen
        fields = [
            "id",
            "screen_number",
            "capacity",
            "screen_type",
            "is_approved",
            "is_active",
            "seats",
            "layout",
            "seat_in_a_row",
        ]


class TheatreSerializer(serializers.ModelSerializer):
    owner = TheatreOwnerSerialzers(read_only=True)
    screens = ScreenSerializer(many=True)
    city = CitySerializer(read_only=True)
    total_screens = serializers.SerializerMethodField()

    class Meta:
        model = Theatre
        fields = [
            "id",
            "name",
            "city",
            "total_screens",
            "address",
            "is_confirmed",
            "has_screen",
            "owner",
            "screens",
        ]

    def get_total_screens(self, obj):
        screens = Screen.objects.filter(theatre=obj.id)
        if screens.exists():
            return screens.count()
        return None


class MovieSerializers(serializers.ModelSerializer):

    class Meta:
        model = Movie
        fields = [
            "id",
            "title",
            "language",
            "duration",
            "release_date",
            "description",
            "genre",
            "poster",
        ]

    def create(self, validated_data):
        movie = Movie.objects.create(**validated_data)
        return movie


class AdminSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminSettings
        fields = ["id", "allow_registration"]
