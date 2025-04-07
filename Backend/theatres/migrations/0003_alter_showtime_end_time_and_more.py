# Generated by Django 5.0.1 on 2025-03-26 04:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movies', '0007_remove_movie_cities'),
        ('theatres', '0002_theatre_is_confirmed_theatre_owner'),
    ]

    operations = [
        migrations.AlterField(
            model_name='showtime',
            name='end_time',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddConstraint(
            model_name='showtime',
            constraint=models.UniqueConstraint(fields=('screen', 'start_time'), name='unique_show_per_screen_time'),
        ),
    ]
