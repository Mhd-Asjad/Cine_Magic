# Generated by Django 5.0.1 on 2025-04-03 14:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("seats", "0001_initial"),
        ("theatres", "0003_alter_showtime_end_time_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="seatscreenlayout",
            name="screen",
            field=models.OneToOneField(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="seat_layout",
                to="theatres.screen",
            ),
        ),
    ]
