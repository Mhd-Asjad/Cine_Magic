# Generated by Django 5.0.1 on 2025-05-22 04:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('theatres', '0010_alter_showtime_unique_together_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='showtime',
            unique_together=set(),
        ),
    ]
