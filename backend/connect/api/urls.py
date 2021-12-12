from os import name
from django.urls import path
from . import views
from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns = [
    path('', views.getRoutes),
    path('register/', views.register, name="register"),

    path('upload-file/', views.uploadFile, name="uploadFile"),
    path('get-file/', views.getFile, name="getFile"),

    path('symbl/token/', views.symblToken, name="symblToken"),

    path('twilio/token/', views.twilioToken, name="twilioToken"),
    
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
