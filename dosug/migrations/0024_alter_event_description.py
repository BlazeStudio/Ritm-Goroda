# Generated by Django 4.2.6 on 2024-03-27 11:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dosug', '0023_event_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='description',
            field=models.CharField(max_length=1400),
        ),
    ]