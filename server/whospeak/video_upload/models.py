import os
from django.db import models
from django.conf import settings

def get_upload_to(instance, filename):
    upload_to = 'videos'
    ext = filename.split('.')[-1]
    media_path = os.path.join(settings.MEDIA_ROOT, upload_to)
    num_files = len(os.listdir(media_path))  
    filename = f'vid{num_files:02}.{ext}'
    return os.path.join(upload_to, filename)

class Video(models.Model):
    file = models.FileField(upload_to='videos/')