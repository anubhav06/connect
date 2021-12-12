from django.db.utils import Error
from django.http import JsonResponse
from rest_framework import permissions, serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


from .serializers import FilesSerializer
from connect.models import User, Files

from django.db import IntegrityError
from rest_framework import status

import requests
import json
import boto3
import boto3.session


# Download the helper library from https://www.twilio.com/docs/python/install
import os
from decouple import config
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VideoGrant


# For download YT video
from pytube import YouTube


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



# FOR TWILIO MEETING
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





# To upload audio file 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def uploadFile(request):
    

    if request.data["audio"] == 'undefined':
        print('Audio undefined')
    else:
        audioFile = request.data["audio"]
        data = Files(user=request.user, audioFile=audioFile)
        data.save()
        print('Audio present')

    
    if request.data["video"] == 'undefined':
        print('video undefined')
    else:
        videoFile = request.data["video"]
        data = Files(user=request.user, videoFile=videoFile)
        data.save()
        print('video present')
    
    return Response('✅ File upload successfull')


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getFile(request):
    
    files = Files.objects.filter(user=request.user)
    serializer = FilesSerializer(files, many=True)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def symblToken(request):

    url = "https://api.symbl.ai/oauth2/token:generate"

    appId = config('SYMBL_APP_ID')  # App Id found in your platform
    appSecret = config('SYMBL_APP_SECRET')  # App Id found in your platform

    payload = {
        "type": "application",
        "appId": appId,
        "appSecret": appSecret
    }
    headers = {
        'Content-Type': 'application/json'
    }

    responses = {
        400: 'Bad Request! Please refer docs for correct input fields.',
        401: 'Unauthorized. Please generate a new access token.',
        404: 'The conversation and/or it\'s metadata you asked could not be found, please check the input provided',
        429: 'Maximum number of concurrent jobs reached. Please wait for some requests to complete.',
        500: 'Something went wrong! Please contact support@symbl.ai'
    }

    response = requests.request("POST", url, headers=headers, data=json.dumps(payload))

    if response.status_code == 200:
        # Successful API execution
        print("accessToken => " + response.json()['accessToken'])  # accessToken of the user
        print("expiresIn => " + str(response.json()['expiresIn']))  # Expiry time in accessToken
    elif response.status_code in responses.keys():
        print(responses[response.status_code], response.text)  # Expected error occurred
    else:
        print("Unexpected error occurred. Please contact support@symbl.ai" + ", Debug Message => " + str(response.text))


    return Response(response)

