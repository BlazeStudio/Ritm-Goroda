# Generated by Django 5.0.1 on 2024-03-06 20:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dosug', '0008_event_datetime'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='datetime',
            field=models.DateTimeField(),
        ),
    ]
