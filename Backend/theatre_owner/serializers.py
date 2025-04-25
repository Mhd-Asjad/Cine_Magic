from rest_framework import serializers
from theatre_owner.models import TheaterOwnerProfile
from movies.models import *
from theatres.models import *
from rest_framework.exceptions import ValidationError
from seats.models import *
class TheatreOwnerSerialzers(serializers.ModelSerializer) :
    class Meta :
        model = TheaterOwnerProfile
        fields = ['user' , 'theatre_name' ,'owner_photo' , 'location' , 'state' , 'pincode' ,'latitude' , 'longitude' , 'user_message']

    def create(self, validated_data) :
        
        Theatre_Owner =  TheaterOwnerProfile.objects.create(**validated_data)
        return Theatre_Owner



class FetchMovieSerializer(serializers.ModelSerializer) :
    
    poster = serializers.SerializerMethodField()
    class Meta :
        model = Movie
        fields = ['id','title' , 'language' , 'duration' , 'release_date' , 'description' , 'genre' , 'poster' ]
        
    def get_poster(self , obj):
        request = self.context.get('request')
        if obj.poster :
            return request.build_absolute_uri(obj.poster.url)
        return None
class TimeSlotSerializer(serializers.ModelSerializer) :
    end_time = serializers.SerializerMethodField()
    class Meta :
        model = TimeSlot
        fields= ['id' , 'start_time' , 'end_time']
        
    def get_end_time(self , obj):
        showtime = ShowTime.objects.filter(slot = obj).first()
        if showtime and showtime.end_time :
            return showtime.end_time.strftime('%H:%M')
        return None
    
class CreateScreenSerializer(serializers.ModelSerializer):
    theatre_name = serializers.CharField(source='theatre.name',read_only=True)
    time_slots = TimeSlotSerializer(many=True , write_only = True)
    class Meta :
        model = Screen
        fields = [ 'id' , 'theatre' , 'theatre_name', 'screen_number' , 'capacity' , 'screen_type' , 'layout' , 'time_slots']

    def create(self, validated_data):
        time_slot_data =  validated_data.pop('time_slots' , [])
        layout = validated_data.get('layout')
        screen = Screen.objects.create(**validated_data)
        
        for time_slot in time_slot_data :
            TimeSlot.objects.create(screen=screen , **time_slot)
                
        rows = layout.rows
        cols = layout.cols
        
        try:
            default_category = SeatCategory.objects.first()  
        except SeatCategory.DoesNotExist:
            raise serializers.ValidationError("No seat categories found. Please create categories first.")
            
            
        for row_number in range(1 , rows + 1):
            row_letter = chr(64 + row_number)
            for seat_number in range(1 , cols+1):
                seats.objects.create(
                    screen=screen,
                    row=row_letter,
                    number =  seat_number ,
                    category= default_category
                )
        return screen

class EditShowTimeSerializer(serializers.ModelSerializer) :
    # start_time = serializers.TimeField()
    class Meta :
        model = ShowTime
        fields = ['id' ,'screen' ,'movie' ,'slot' ,'show_date' , 'end_date']
        
        
    # def validate(self, data):
    #     screen_id = data.get('screen')
    #     new_start_time = data.get('start_time')
    #     duration = timedelta(hours=3)

    #     new_start_dt = datetime.combine(datetime.today(), new_start_time)
    #     new_end_dt = new_start_dt + duration

    #     existing_slots = TimeSlot.objects.filter(screen=screen_id)

    #     for slot in existing_slots:
    #         existing_start_dt = datetime.combine(datetime.today(), slot.start_time)
    #         existing_end_dt = existing_start_dt + duration

    #         if new_start_dt < existing_end_dt and existing_start_dt < new_end_dt:
    #             raise serializers.ValidationError("This time slot overlaps with an existing one.")

    #     return data
        
    def update(self , instance , validated_data):
        screen = validated_data.get('screen' , instance.screen)
        movie = validated_data.get('movie' , instance.movie)
        slot = validated_data.get('slot' , instance.slot)
        new_start_date = validated_data.get('show_date' , instance.show_date)
        new_end_date = validated_data.get('end_date' , instance.end_date)
        print(new_start_date)
        print(new_end_date)

            
        ShowTime.objects.filter(
            screen = screen,
            movie = movie,
            slot = slot,
            show_date__gt = new_end_date
        ).delete()
        
        existing_dates = set(
            ShowTime.objects.filter(
                screen=screen,
                slot=slot,
                movie=movie,
                show_date__range=(new_start_date, new_end_date)
            ).values_list('show_date', flat=True)
        )
        print(existing_dates)
        
        date_list = [new_start_date + timedelta(days=i) for i in range((new_end_date - new_start_date).days + 1)]
        start_time = slot.start_time
        end_time = (datetime.combine(datetime.today(), start_time) + timedelta(minutes=movie.duration)).time()
        print('reachers hereee')
        new_showtimes = []
        
        for show_date in date_list : 
            if show_date not in existing_dates :
                new_showtimes.append(ShowTime(
                    screen=screen,
                    movie=movie,
                    slot=slot,
                    show_date=show_date,
                    end_time=end_time
                ))
                
        ShowTime.objects.bulk_create(new_showtimes)
        
        # updating new showdate for instancess
        instance.show_date = new_start_date
        instance.end_date = new_end_date
        instance.save()

        return instance
        
class Createshowtimeserializers(serializers.ModelSerializer):
    movie_name = serializers.CharField(source='movie.title',read_only = True)
    screen_number = serializers.CharField(source='screen.screen_number')
    start_time = serializers.CharField(source='slot.start_time' , read_only=True)
    
    class Meta :
        model = ShowTime
        fields = ['id' ,'movie_name' ,'screen_number' ,'screen' ,'movie' ,'slot' ,'show_date' , 'end_date' , 'start_time' ,'end_time']
        
    
    def create(self , validated_data):  
        screen = validated_data['screen']
        movie = validated_data['movie']
        slot = validated_data['slot']
        show_date = validated_data['show_date']
        end_date = validated_data.get('end_date') 


        if not end_date:
            end_date = show_date

        date_list = [show_date + timedelta(days=i) for i in range((end_date - show_date).days + 1)]
        
        start_time = slot.start_time
        start_dt = datetime.combine(datetime.today(), start_time)

        end_time = (start_dt + timedelta(minutes=movie.duration)).time()

        showtime_list = [
            
            ShowTime(
                screen=screen,
                movie=movie,
                slot=slot,
                show_date=date,
                end_time=end_time,
                end_date = end_date
            )
            
            for date in date_list
        ]

        ShowTime.objects.bulk_create(showtime_list)
        return showtime_list[0]
        
    
class UpdateTheatreOwnerSeriailizer(serializers.ModelSerializer):
    class Meta :
        model = TheaterOwnerProfile
        fields = ['id' , 'theatre_name' , 'location' , 'state' , 'pincode']