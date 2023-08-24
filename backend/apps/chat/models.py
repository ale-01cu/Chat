import json
from datetime import timedelta

from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from rest_framework_simplejwt.tokens import AccessToken
from apps.user.models import UserAccount

from channels.layers import get_channel_layer
# from .signals import presence_changed

channel_layer = get_channel_layer()

class Presence(models.Model):
    class PresenceManager(models.Manager):
        def touch(self, channel_name):
            self.filter(
                channel_name=channel_name
            ).update(last_seen=now())

        def leave_all(self, channel_name):
            for presence in self.select_related("room").filter(channel_name=channel_name):
                room = presence.room
                room.remove_presence(presence=presence)
                
    class Meta:
        unique_together = [("room", "channel_name")]
        verbose_name = 'Usuario de Salas'
        verbose_name_plural = 'Usuarios de Salas'
        
    
    room = models.ForeignKey(
        "Room", 
        verbose_name='Sala',
        related_name='presence_room',
        on_delete=models.CASCADE
    )
    channel_name = models.CharField(
        max_length=255, 
        verbose_name='Nombre del canal',
        help_text="Reply channel for connection that is present"
    )
    user = models.ForeignKey(
        UserAccount,
        on_delete=models.CASCADE,
        related_name='presence_user'
    )
    
    online = models.BooleanField(
        default=True,
        verbose_name='Conectado'
    )
    
    last_seen = models.DateTimeField(
        auto_now_add=True
    )

    objects = PresenceManager()
    
    @property
    def token(self):
        AccessToken.for_user(self.user)

    def __str__(self):
        return self.user.username
        
    

class Room(models.Model):
    class RoomManager(models.Manager):
        def add(self, room_channel_name, user_channel_name, user=None):
            room, created = Room.objects.get_or_create(
                room_name=room_channel_name
            )
            room.add_presence(user_channel_name, user)
            return room

        def remove(self, room_channel_name, user_channel_name):
            try:
                room = Room.objects.get(room_name=room_channel_name)
            except Room.DoesNotExist:
                return
            room.remove_presence(user_channel_name)

        def prune_presences(self, channel_layer=None, age=None):
            for room in Room.objects.all():
                room.prune_presences(age)

        def prune_rooms(self):
            Room.objects.filter(presence__isnull=True).delete()
    
    class Meta:
        verbose_name = 'Sala'
        verbose_name_plural = 'Salas'
    
    room_name = models.CharField(
        max_length=255,
        unique=True,
    )
    
    objects = RoomManager()

    def __str__(self):
        return self.room_name

    def add_presence(self, channel_name, user=None):
        if user and user.is_authenticated:
            authed_user = user

            presence, created = Presence.objects.get_or_create(
                room=self, 
                user=authed_user
            )

            if presence:
                presence.channel_name = channel_name
                presence.online = True
                presence.save()
                
                
        else:
            print("El usuario no se agrego como conectado porque no esta logueado.")

    def remove_presence(self, channel_name=None, presence=None):
        if presence is None:
            try:
                presence = Presence.objects.get(
                    room=self, 
                    channel_name=channel_name
                )
            except Presence.DoesNotExist:
                return

        presence.online = False
        presence.save()
        # self.broadcast_changed(removed=presence)

    def prune_presences(self, age_in_seconds=None):
        if age_in_seconds is None:
            age_in_seconds = getattr(settings, "CHANNELS_PRESENCE_MAX_AGE", 60)

        num_deleted, num_per_type = Presence.objects.filter(
            room=self, last_seen__lt=now() - timedelta(seconds=age_in_seconds)
        ).delete()
        if num_deleted > 0:
            self.broadcast_changed(bulk_change=True)

    def get_users(self):
        User = get_user_model()
        return User.objects.filter(
            presence__room=self, 
            presence__online=True
        )

    # def get_anonymous_count(self):
    #     return self.presence_set.filter(user=None).count()

    # def broadcast_changed(self, added=None, removed=None, bulk_change=False):
    #     presence_changed.send(
    #         sender=self.__class__,
    #         room=self,
    #         added=added,
    #         removed=removed,
    #         bulk_change=bulk_change,
    #     )


class Message(models.Model):
    class Meta:
        verbose_name = 'Mensaje'
        verbose_name_plural = 'Mensajes'
        
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name='messages',
        verbose_name='Sala'
    )
    
    presence = models.ForeignKey(
        Presence,
        on_delete=models.CASCADE,
        related_name='messages',
        verbose_name='Usuario del mensaje'
    )
    
    message = models.CharField(
        max_length=255,
        verbose_name='Contenido del mensaje'
    )
    
    create_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Fecha de creado el mensaje'
    )
    
    def __str__(self) -> str:
        return self.presence.user.username