from django.db import models


class Event(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=30, null=False)
    type = models.CharField(max_length=20)
    image = models.CharField(max_length=20)
    tiny_description = models.CharField(max_length=250)
    description = models.CharField(max_length=500)
    link = models.CharField(max_length=30)
    address = models.CharField(max_length=60)
    coordinates = models.CharField(max_length=100)
    views = models.IntegerField(default=0)

    def views_add(self):
        self.views += 1
        self.save()

    def __str__(self):
        return self.title