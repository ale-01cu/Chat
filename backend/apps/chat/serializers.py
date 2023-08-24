from .models import Presence, Message
from rest_framework import serializers
from apps.user.serializers import UserSerializer

class PresenceSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Presence
        exclude = (
            'room', 
            'channel_name', 
            'online',
            'last_seen'
        )
        
class MessageSerializer(serializers.ModelSerializer):
    presence = PresenceSerializer()
    
    class Meta:
        model = Message
        exclude = ('room',)