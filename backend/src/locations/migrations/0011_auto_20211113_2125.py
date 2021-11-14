# Generated by Django 3.2.2 on 2021-11-13 21:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('locations', '0010_location_phone'),
    ]

    operations = [
        migrations.AddField(
            model_name='location',
            name='geographic_entity',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='location',
            name='inexact_location',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='location',
            name='published',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='location',
            name='address',
            field=models.CharField(blank=True, max_length=128, null=True),
        ),
    ]