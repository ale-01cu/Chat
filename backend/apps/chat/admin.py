from django.contrib import admin
from .models import Room, Presence, Message
# Register your models here.

class PresenceAdminTabularInline(admin.TabularInline):
    model = Presence
    extra = 0
class MessageTabularInline(admin.TabularInline):
    model = Message
    extra = 0
    
class PresenceAdmin(admin.ModelAdmin):
    inlines = [MessageTabularInline]
    list_display = ('id', 'user', 'room', 'online', 'last_seen')
    list_display_links = ('id', 'user', 'room')

class RoomAdmin(admin.ModelAdmin):
    inlines = [PresenceAdminTabularInline, MessageTabularInline]
    list_display = ('id', 'room_name')
    list_display_links = ('id', 'room_name')
    
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'presence', 'room')
    list_display_links = ('id', 'presence', 'room')
    
    
admin.site.register(Room, RoomAdmin)
admin.site.register(Presence, PresenceAdmin)
admin.site.register(Message, MessageAdmin)