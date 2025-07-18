# Generated by Django 5.0.1 on 2025-02-08 08:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("theatre_owner", "0002_rename_theateownerprofile_theaterownerprofile"),
        ("theatres", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="theatre",
            name="is_confirmed",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="theatre",
            name="owner",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="theatres",
                to="theatre_owner.theaterownerprofile",
            ),
        ),
    ]
