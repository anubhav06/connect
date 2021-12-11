from django.http import JsonResponse
from rest_framework import permissions, serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import TokenSerializer
from connect.models import User

from django.db import IntegrityError
from rest_framework import status


# Download the helper library from https://www.twilio.com/docs/python/install
import os
from decouple import config
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant


# Required for all Twilio Access Tokens
# To set up environmental variables, see http://twil.io/secure
account_sid = config('TWILIO_ACCOUNT_SID')
api_key = config('TWILIO_API_KEY')
api_secret = config('TWILIO_API_KEY_SECRET')




class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
        '/api/register',
        '/api/twilio/token'
    ]

    return Response(routes)


# User registration logic
@api_view(['GET', 'POST'])
def register(request):
    username = request.data["username"]
    email = request.data["email"]

    # Ensure password matches confirmation
    password = request.data["password"]
    confirmation = request.data["confirmPassword"]
    if password != confirmation:
        return Response("ERROR: Passwords don't match", status=status.HTTP_406_NOT_ACCEPTABLE)
    
    # Input validation. Check if all data is provided
    if not email or not username or not password or not confirmation:
        return Response('All data is required')

    # Attempt to create new user
    try:
        user = User.objects.create_user(username, email, password)
        user.save()
    except IntegrityError:
        return Response("ERROR: Username already taken", status=status.HTTP_406_NOT_ACCEPTABLE)
    return Response('Registered Successfully from backend')



@api_view(['POST'])
def twilioToken(request):
    
    identity = request.data["user_identity"]
    
    # required for Video grant
    # Create Access Token with credentials
    token = AccessToken(account_sid, api_key, api_secret, identity=identity)

    roomCode = request.data["room_name"]
    print('Room Name: ', roomCode)

    # Create a Video grant and add to token
    video_grant = VideoGrant(room=str(roomCode))
    token.add_grant(video_grant)

    token = str(token.to_jwt())

    return Response(token)