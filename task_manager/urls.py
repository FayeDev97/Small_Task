from django.urls import path
from . import views

app_name = "task_manager"
urlpatterns = [
    path('', views.index, name='index'),
    path('tasks/', views.get, name='getAll'),
    path('task/<int:task_id>', views.get, name='get'),
    path('task/', views.post, name='post'),
    path('task/<int:task_id>/', views.put, name='put'),
    path('task/<int:task_id>/delete', views.delete, name='delete'),
    path('task/<int:task_id>/complete', views.complete, name='complete'),
]