from django.db import models
from rest_framework import fields, serializers
from rest_framework.serializers import ModelSerializer

from connect.models import Files



class FilesSerializer(ModelSerializer):
   class Meta:
      model = Files
      fields = '__all__'