from rest_framework import serializers
from theatre_owner.models import TheaterOwnerProfile
from movies.models import *
from theatres.models import *
from rest_framework.exceptions import ValidationError
from seats.models import *
from collections import Counter
import logging

logger = logging.getLogger(__name__)


class TheatreOwnerSerialzers(serializers.ModelSerializer):

    class Meta:
        model = TheaterOwnerProfile
        fields = [
            "id",
            "user",
            "theatre_name",
            "location",
            "state",
            "owner_photo",
            "pincode",
            "latitude",
            "longitude",
            "user_message",
        ]

    def create(self, validated_data):

        Theatre_Owner = TheaterOwnerProfile.objects.create(**validated_data)
        return Theatre_Owner


class FetchMovieSerializer(serializers.ModelSerializer):

    poster = serializers.SerializerMethodField()

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

    def get_poster(self, obj):
        request = self.context.get("request")
        if obj.poster:
            return request.build_absolute_uri(obj.poster.url)
        return None


class TimeSlotSerializer(serializers.ModelSerializer):
    end_time = serializers.SerializerMethodField()

    class Meta:
        model = TimeSlot
        fields = ["id", "start_time", "end_time"]

    def get_end_time(self, obj):
        """Get the latest end time among all shows for this slot"""
        show_slots = ShowSlot.objects.filter(slot=obj).order_by("-calculated_end_time")

        if show_slots.exists() and show_slots.first().calculated_end_time:
            return show_slots.first().calculated_end_time.strftime("%H:%M")
        return None


class CreateScreenSerializer(serializers.ModelSerializer):
    theatre_name = serializers.CharField(source="theatre.name", read_only=True)
    time_slots = TimeSlotSerializer(many=True, write_only=True)
    selected_seats = serializers.ListField(
        child=serializers.CharField(), required=False
    )

    class Meta:
        model = Screen
        fields = [
            "id",
            "theatre",
            "is_active",
            "theatre_name",
            "screen_number",
            "capacity",
            "screen_type",
            "is_approved",
            "layout",
            "time_slots",
            "selected_seats",
        ]

    def create(self, validated_data):
        time_slot_data = validated_data.pop("time_slots", [])
        layout = validated_data.get("layout")
        gap_labels = validated_data.pop("selected_seats", [])
        screen = Screen.objects.create(**validated_data)

        for time_slot in time_slot_data:
            TimeSlot.objects.create(screen=screen, **time_slot)

        print(gap_labels, "unselected seats")
        rows = layout.rows
        cols = layout.cols
        try:
            default_category = SeatCategory.objects.first()
        except SeatCategory.DoesNotExist:
            raise serializers.ValidationError(
                "No seat categories found. Please create categories first."
            )

        col_numbers = [seat[:1] for seat in gap_labels]
        count = Counter(col_numbers)
        print(gap_labels, count, "unselected seats")

        for key, value in count.items():
            if value == cols:
                rows -= 1
                print("row removed")
        print(rows, "rows")

        for row_number in range(1, rows + 1):
            row_letter = chr(64 + row_number)
            for seat_number in range(1, cols + 1):
                seats.objects.create(
                    screen=screen,
                    row=row_letter,
                    number=seat_number,
                    category=default_category,
                    is_seat=(
                        False if row_letter + str(seat_number) in gap_labels else True
                    ),
                )
        return screen


class FechShowSerializer(serializers.ModelSerializer):
    start_time = serializers.CharField(source="slot.start_time", read_only=True)
    theatre_name = serializers.CharField(source="screen.theatre.name", read_only=True)
    theatre_details = serializers.CharField(
        source="screen.theatre.address", read_only=True
    )
    movie_title = serializers.CharField(source="movie.title", read_only=True)
    slot = serializers.SerializerMethodField()

    class Meta:
        model = ShowTime
        fields = [
            "screen",
            "movie",
            "movie_title",
            "theatre_name",
            "theatre_details",
            "slot",
            "show_date",
            "start_time",
            "end_time",
        ]

    def get_slot(self, obj):
        slot_id = self.context.get("slot_id")
        logger.info(f"show time slot : {slot_id}")
        show_id = self.context.get("show_id")
        logger.info(f"show time Id : {show_id}")
        if not slot_id:
            return None
        try:

            showslot = ShowSlot.objects.filter(showtime=show_id, slot=slot_id).first()
            return {
                "id": showslot.id,
                "start_time": showslot.slot.start_time.strftime("%H:%M"),
                "end_time": (
                    showslot.calculated_end_time
                    if showslot.calculated_end_time
                    else None
                ),
            }

        except ShowSlot.DoesNotExist:
            raise serializers.ValidationError("Invalid slot ID provided")


class Createshowtimeserializers(serializers.ModelSerializer):
    movie_name = serializers.CharField(source="movie.title", read_only=True)
    screen_number = serializers.CharField(source="screen.screen_number")
    start_time = serializers.CharField(source="slot.start_time", read_only=True)
    poster = serializers.SerializerMethodField()
    slot = serializers.PrimaryKeyRelatedField(
        queryset=TimeSlot.objects.all(), many=True
    )

    class Meta:
        model = ShowTime
        fields = [
            "id",
            "movie_name",
            "poster",
            "screen_number",
            "screen",
            "movie",
            "slot",
            "show_date",
            "end_date",
            "start_time",
            "end_time",
        ]

    def get_poster(self, obj):
        request = self.context.get("request")
        if obj.movie and obj.movie.poster:
            return request.build_absolute_uri(obj.movie.poster.url)
        return None

    def create(self, validated_data):
        screen = validated_data["screen"]
        movie = validated_data["movie"]
        slot_list = validated_data.pop("slot")
        show_date = validated_data["show_date"]
        end_date = validated_data.get("end_date")

        logger.info(f"recieved slot_id", slot_list)

        if not slot_list:
            raise ValidationError("no valid slot id provided")

        date_list = [
            show_date + timedelta(days=i)
            for i in range((end_date - show_date).days + 1)
        ]
        show_time_list = []

        for date in date_list:
            shows = ShowTime.objects.create(
                movie=movie,
                screen=screen,
                show_date=date,
                end_date=end_date,
            )
            for slot in slot_list:
                ShowSlot.objects.create(showtime=shows, slot=slot)

            show_time_list.append(shows)

        logger.info(
            f"Creating showtimes for movie: {movie}, screen: {screen}, dates: {date_list}"
        )
        logger.info(f"Created showtimes: {show_time_list}")
        return show_time_list[0] if show_time_list else None


class FetchShowTimeSerializer(serializers.ModelSerializer):
    movie_name = serializers.CharField(source="movie.title", read_only=True)
    screen_number = serializers.CharField(source="screen.screen_number", read_only=True)
    showtimes = serializers.SerializerMethodField()
    poster = serializers.SerializerMethodField()

    class Meta:
        model = ShowTime
        fields = [
            "id",
            "movie_name",
            "poster",
            "screen_number",
            "slots",
            "showtimes",
            "screen",
            "movie",
            "show_date",
            "end_date",
            "end_time",
        ]

    def get_poster(self, obj):
        request = self.context.get("request")
        if obj.movie.poster:
            return request.build_absolute_uri(obj.movie.poster.url)
        return None

    def get_showtimes(self, obj):

        return [{"start_time": slot.start_time} for slot in obj.slots.all()]


class UpdateTheatreOwnerSeriailizer(serializers.ModelSerializer):
    class Meta:
        model = TheaterOwnerProfile
        fields = [
            "id",
            "user",
            "owner_photo",
            "theatre_name",
            "location",
            "state",
            "pincode",
            "ownership_status",
        ]


class UpdateTheatreOwnerSerializer(serializers.ModelSerializer):
    avatar_config = serializers.JSONField(allow_null=True, required=False)
    owner_photo = serializers.ImageField(allow_null=True, required=False)

    class Meta:
        model = TheaterOwnerProfile
        fields = ["owner_photo", "avatar_config"]

    def validate(self, data):
        if not data.get("owner_photo") and not data.get("avatar_config"):
            raise serializers.ValidationError(
                "At least one of owner_photo or avatar_config must be provided."
            )
        return data
