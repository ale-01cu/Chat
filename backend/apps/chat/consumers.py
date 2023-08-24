import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Room, Message, Presence
from apps.user.serializers import UserSerializer
from .serializers import MessageSerializer
from django.contrib.auth import get_user_model
User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    user: User
    
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"
        self.user = self.scope['user']
        
        room = await sync_to_async(Room.objects.add)(
            self.room_name, 
            self.channel_name, 
            self.user
        )
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name, 
            self.channel_name,
        )
        
        await self.accept()
        
        users = await sync_to_async(
            self.get_users_list_from_room)(room)
        
        # Send users to room group
        await self.channel_layer.group_send(
            self.room_group_name, 
            {
                "type": "users_online", 
                "users": users
            }
        )
        
        messages = await sync_to_async(self.get_message_from_room)()
        # Send messages to room group
        await self.channel_layer.send(
            self.channel_name,
            {
                "type": "chat_message", 
                "message": messages
            }
        )
        

    async def disconnect(self, close_code):
        # Leave room group
        
        await sync_to_async(Room.objects.remove)(
            self.room_name, 
            self.channel_name
        )

        await self.channel_layer.group_discard(
            self.room_group_name, 
            self.channel_name
        )
        
        room = await sync_to_async(Room.objects.get)(
            room_name=self.room_name
        )
        
        users = await sync_to_async(
            self.get_users_list_from_room)(room)
        
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, 
            {
                "type": "users_online", 
                "users": users
            }
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        message = await sync_to_async(self.save_message)(message)
        
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, 
            {
                "type": "chat_message", 
                "message": message
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event["message"]
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            "message": message,
        }))
        
        
    async def users_online(self, event):
        users = event["users"]
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            "users": users
        }))
        
        
    def get_users_list_from_room(self, room: Room):
        users_online = room.presence_room.filter(online=True)
        users = []
        
        for presence in users_online:
            user = presence.user
            users.append(user)

        # Finalmente, usa el serializador para serializar la lista de usuarios
        serializer = UserSerializer(
            users, many=True)
        serialized_data = serializer.data
        
        return serialized_data
    
    def save_message(self, message):
        user_presence = Presence.objects.get(user=self.user)
        room = Room.objects.get(room_name=self.room_name)
        
        message = Message(
            room=room, 
            presence=user_presence, 
            message=message
        )
        
        message.save()
        
        message_serializer = MessageSerializer(message)
        return message_serializer.data
    
    def get_message_from_room(self):
        room = Room.objects.get(room_name=self.room_name)
        messages = room.messages.all()
        messages_serializer = MessageSerializer(
            messages, many=True)
        
        return messages_serializer.data