from django.db import models
from datetime import datetime

# Create your models here.

class Tag(models.Model):
    name = models.CharField(max_length=50, null=False,blank=False)

    def __str__(self):
        return self.name


class Task(models.Model):
    text = models.CharField(max_length=200, null=False, blank=False)
    tags = models.ManyToManyField(Tag, blank=True)
    create_date = models.DateField()
    last_update = models.DateField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.text