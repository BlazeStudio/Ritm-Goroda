# Generated by Django 5.0.1 on 2024-03-09 15:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dosug', '0011_alter_event_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='image',
            field=models.CharField(max_length=50),
        ),
    ]