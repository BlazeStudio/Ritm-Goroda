from django.contrib.auth.models import User
from django.db import models
from datetime import datetime, date

class Event(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=30, null=False)
    type = models.CharField(max_length=20)
    image = models.ImageField(default="default.jpg")
    tiny_description = models.CharField(max_length=250)
    description = models.CharField(max_length=1400)
    link = models.CharField(max_length=30)
    address = models.CharField(max_length=60)
    price = models.IntegerField(default=0)
    phone = models.CharField(max_length=30)
    coordinates = models.CharField(max_length=100)
    views = models.IntegerField(default=0)
    author = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=datetime.now, blank=True)

    def days_since_creation(self):
        current_datetime = datetime.now()
        time_difference = current_datetime - self.created_at
        days_since_creation = time_difference.days
        return days_since_creation

    def views_add(self):
        current_date = date.today()
        existing_entry = StatsDate.objects.filter(date=current_date, event_id=self.id).first()
        if existing_entry:
            existing_entry.views += 1
            existing_entry.save()
        else:
            new_entry = StatsDate(event_id=self.id, date=current_date, views=1)
            new_entry.save()
        self.views += 1
        self.save()
        days = self.days_since_creation()
        existing_entry = StatsDays.objects.filter(day=days, event_id=self.id).first()
        if existing_entry:
            existing_entry.views += 1
            existing_entry.save()
        else:
            new_entry = StatsDays(event_id=self.id, day=days, views=self.views)
            new_entry.save()

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

class StatsDate(models.Model):
    event_id = models.IntegerField()
    date = models.DateField(null=False)
    views = models.IntegerField()

class StatsDays(models.Model):
    event_id = models.IntegerField()
    day = models.IntegerField()
    views = models.IntegerField()


User.add_to_class('type', models.CharField(max_length=60, default="Пользователь"))
User.add_to_class('org_name', models.CharField(max_length=150, null=True))