from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser, User

# Create your models here.



class Files(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="filesUser")
    audioFile = models.FileField()
    videoFile = models.FileField()

    def __str__(self):
        return f"Audio: {self.audioFile} | Video: {self.videoFile}"