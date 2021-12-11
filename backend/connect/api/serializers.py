from rest_framework import serializers



class TokenSerializer(serializers.Serializer):
   user_identity = serializers.CharField()

class RoomSerializer(serializers.Serializer):
   """Your data serializer, define your fields here."""
   account_sid = serializers.CharField()
   date_created = serializers.DateTimeField()
   date_updated = serializers.DateTimeField()
   status = serializers.CharField()
   type = serializers.CharField()
   sid = serializers.CharField()
   enable_turn = serializers.BooleanField()
   unique_name = serializers.CharField()
   max_concurrent_published_tracks = serializers.IntegerField()
   max_participants = serializers.IntegerField()
   max_participant_duration = serializers.IntegerField()
   duration = serializers.IntegerField()
   status_callback_method = serializers.CharField()
   record_participants_on_connect = serializers.BooleanField()
   video_codecs = serializers.ListField()
   media_region = serializers.CharField()
   audio_only = serializers.BooleanField()
   end_time = serializers.DateTimeField()
   url = serializers.CharField()
   links = serializers.JSONField()

