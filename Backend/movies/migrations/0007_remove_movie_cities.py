# Generated by Django 5.0.1 on 2025-03-26 04:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("movies", "0006_alter_movie_created_at"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="movie",
            name="cities",
        ),
    ]
