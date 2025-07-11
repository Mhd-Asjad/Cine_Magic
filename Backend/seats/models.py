from django.db import models

# from theatres.models import *
# Create your models here.


class SeatScreenLayout(models.Model):
    screen = models.OneToOneField(
        "theatres.Screen",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="seat_layout",
    )
    name = models.CharField(max_length=100)
    rows = models.PositiveIntegerField()
    cols = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.name} ({self.rows}  x {self.cols})"

    @property
    def total_capacity(self):
        return self.rows * self.cols


class SeatCategory(models.Model):
    name = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=90.00)

    def __str__(self):
        return self.name


class seats(models.Model):
    screen = models.ForeignKey(
        "theatres.Screen", on_delete=models.CASCADE, related_name="seats"
    )
    row = models.CharField(max_length=3)
    number = models.PositiveIntegerField()
    category = models.ForeignKey(
        SeatCategory, on_delete=models.CASCADE, null=True, blank=True
    )
    is_active = models.BooleanField(default=True)
    is_seat = models.BooleanField(default=True)

    # class Meta :
    #     unique_together = ('screen' , 'row' , 'number')

    def __str__(self):
        return f"{self.row}{self.number} - screen {self.screen.screen_number} in {self.screen.theatre.name}"
