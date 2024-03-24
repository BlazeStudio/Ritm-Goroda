from django.contrib.auth.models import User
from django.db import models
from datetime import datetime

class Event(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=30, null=False)
    type = models.CharField(max_length=20)
    image = models.ImageField(default="default.jpg")
    tiny_description = models.CharField(max_length=250)
    description = models.CharField(max_length=1200)
    link = models.CharField(max_length=30)
    address = models.CharField(max_length=60)
    price = models.IntegerField(max_length=30, default=0)
    phone = models.CharField(max_length=30)
    coordinates = models.CharField(max_length=100)
    views = models.IntegerField(default=0)
    author = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=datetime.now, blank=True)


    def views_add(self):
        self.views += 1
        self.save()

    def __str__(self):
        return self.title

class DateTimeData(models.Model):
    event_id = models.IntegerField()
    datetime = models.DateTimeField(null=True, blank=True)
    date_range_from = models.DateField(null=True, blank=True)
    date_range_to = models.DateField(null=True, blank=True)
    datetime_from_date = models.DateField(null=True, blank=True)
    datetime_to_date = models.DateField(null=True, blank=True)
    datetime_from_time = models.TimeField(null=True, blank=True)
    datetime_to_time = models.TimeField(null=True, blank=True)
    every_day = models.CharField(max_length=30, null=True)


User.add_to_class('type', models.CharField(max_length=60, default="Пользователь"))