# Generated by Django 4.2.6 on 2024-03-27 13:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dosug', '0024_alter_event_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='price',
            field=models.IntegerField(default=0),
        ),
    ]
