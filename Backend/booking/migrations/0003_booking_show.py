# Generated by Django 5.0.1 on 2025-05-23 13:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("booking", "0002_remove_booking_show"),
        ("theatres", "0009_alter_showtime_unique_together_remove_showtime_slot"),
    ]

    operations = [
        migrations.AddField(
            model_name="booking",
            name="show",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to="theatres.showtime",
            ),
        ),
    ]
