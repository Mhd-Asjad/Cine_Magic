# Generated by Django 5.0.1 on 2025-05-08 08:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("useracc", "0010_user_is_theatre_owner"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="user",
            name="user_type",
        ),
    ]
