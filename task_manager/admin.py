from django.contrib import admin

# Register your models here.
from .models import Task, Tag

admin.site.register(Task)
admin.site.register(Tag)