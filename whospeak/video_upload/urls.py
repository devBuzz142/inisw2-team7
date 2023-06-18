# video_upload/urls.py
from django.urls import path
from . import views

app_name = 'video_upload'

urlpatterns = [
    path('upload/', views.upload, name='upload'),
    path('edit/', views.edit, name='edit'),
    path('test/', views.test, name='test'),
    path('test2/', views.test2, name='test2'),
]
