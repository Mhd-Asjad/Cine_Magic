# Generated by Django 5.0.1 on 2025-04-23 01:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("seats", "0004_remove_seatcategory_price_factor_seatcategory_price_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="seats",
            name="is_seat",
            field=models.BooleanField(default=True),
        ),
    ]
